from pydantic import BaseModel, ConfigDict


class RequirementProgress(BaseModel):
    required: int
    earned: int
    remaining: int
    percent: float


class GraduationProgressRead(BaseModel):
    program_id: int | None
    department: str
    major: str | None
    curriculum_year: int | None
    categories: dict[str, RequirementProgress]
    total: RequirementProgress
    completed_course_numbers: list[str]


class CourseRecommendationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    course_number: str
    course_name_ko: str
    course_name_en: str | None
    completion_category: str
    recommended_semester: str
    credits: int
    reason: str


class GraduationRecommendationRead(BaseModel):
    program_id: int | None
    next_courses: list[CourseRecommendationRead]
    retake_courses: list[CourseRecommendationRead]
