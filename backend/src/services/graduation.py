from collections import defaultdict

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from src.models import AcademicProgram, CourseRecord, CurriculumCourse, User

CATEGORY_REQUIREMENT_MAP = {
    "liberal_required": {"효원핵심교양", "기초교양"},
    "liberal_elective": {"효원균형교양", "효원창의교양"},
    "major_basic": {"전공기초"},
    "major_required": {"전공필수"},
    "major_elective": {"전공선택"},
    "general_elective": {"일반선택"},
}

LOW_GRADES = {"F", "D0", "D+", "D"}


def _find_program(db: Session, user: User) -> AcademicProgram | None:
    query = (
        select(AcademicProgram)
        .where(AcademicProgram.department == user.department)
        .options(selectinload(AcademicProgram.courses), selectinload(AcademicProgram.graduation_requirement))
        .order_by(AcademicProgram.curriculum_year.desc(), AcademicProgram.id.desc())
    )
    candidates = db.scalars(query).all()
    if user.major:
        for program in candidates:
            if program.major == user.major:
                return program
    return candidates[0] if candidates else None


def _records_for_user(db: Session, user_id: int) -> list[CourseRecord]:
    return db.scalars(select(CourseRecord).where(CourseRecord.user_id == user_id)).all()


def _requirement_value(requirement, key: str) -> int:
    return int(getattr(requirement, key, 0) or 0)


def _category_key(category: str) -> str | None:
    for key, categories in CATEGORY_REQUIREMENT_MAP.items():
        if category in categories:
            return key
    return None


def _progress(required: int, earned: int) -> dict:
    capped_earned = min(earned, required) if required else earned
    percent = round((capped_earned / required) * 100, 1) if required else 100.0
    return {
        "required": required,
        "earned": earned,
        "remaining": max(required - earned, 0),
        "percent": percent,
    }


def calculate_progress(db: Session, user: User) -> dict:
    program = _find_program(db, user)
    if not program or not program.graduation_requirement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자 학과/전공에 맞는 졸업요건을 찾을 수 없습니다.",
        )

    records = _records_for_user(db, user.id)
    earned_by_key: dict[str, int] = defaultdict(int)
    completed_course_numbers: list[str] = []

    for record in records:
        if record.grade in LOW_GRADES:
            continue
        category_key = _category_key(record.completion_category)
        if category_key:
            earned_by_key[category_key] += record.credits
        completed_course_numbers.append(record.course_number)

    requirement = program.graduation_requirement
    categories = {
        key: _progress(_requirement_value(requirement, key), earned_by_key[key])
        for key in CATEGORY_REQUIREMENT_MAP
    }
    total_earned = sum(record.credits for record in records if record.grade not in LOW_GRADES)

    return {
        "program_id": program.id,
        "department": program.department,
        "major": program.major,
        "curriculum_year": program.curriculum_year,
        "categories": categories,
        "total": _progress(requirement.total_credits, total_earned),
        "completed_course_numbers": sorted(set(completed_course_numbers)),
    }


def recommend_next(db: Session, user: User, limit: int = 8) -> list[dict]:
    program = _find_program(db, user)
    if not program:
        return []

    progress = calculate_progress(db, user)
    completed = set(progress["completed_course_numbers"])
    needed_keys = {
        key
        for key, value in progress["categories"].items()
        if value["remaining"] > 0
    }

    recommendations = []
    for course in sorted(program.courses, key=lambda item: (item.recommended_semester, item.id)):
        if course.course_number in completed:
            continue
        category_key = _category_key(course.completion_category)
        if category_key not in needed_keys:
            continue
        recommendations.append(_course_recommendation(course, "아직 충족하지 못한 졸업요건 영역의 과목입니다."))
        if len(recommendations) >= limit:
            break
    return recommendations


def recommend_retake(db: Session, user: User, limit: int = 5) -> list[dict]:
    program = _find_program(db, user)
    if not program:
        return []

    low_records = [record for record in _records_for_user(db, user.id) if record.grade in LOW_GRADES or record.is_retake]
    courses_by_number: dict[str, CurriculumCourse] = {course.course_number: course for course in program.courses}

    recommendations = []
    for record in low_records:
        course = courses_by_number.get(record.course_number)
        if course:
            recommendations.append(_course_recommendation(course, "낮은 성적 또는 재수강 표시가 있는 과목입니다."))
        if len(recommendations) >= limit:
            break
    return recommendations


def build_recommendations(db: Session, user: User) -> dict:
    program = _find_program(db, user)
    return {
        "program_id": program.id if program else None,
        "next_courses": recommend_next(db, user),
        "retake_courses": recommend_retake(db, user),
    }


def _course_recommendation(course: CurriculumCourse, reason: str) -> dict:
    return {
        "id": course.id,
        "course_number": course.course_number,
        "course_name_ko": course.course_name_ko,
        "course_name_en": course.course_name_en,
        "completion_category": course.completion_category,
        "recommended_semester": course.recommended_semester,
        "credits": course.credits,
        "reason": reason,
    }
