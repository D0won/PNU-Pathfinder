from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from src.auth.router import get_current_user
from src.courses.schemas import CourseRecordCreate, CourseRecordRead
from src.database import get_db
from src.models import CourseRecord, User

router = APIRouter(prefix="/api/courses", tags=["courses"])


@router.post("", response_model=CourseRecordRead, status_code=status.HTTP_201_CREATED)
def create_course_record(
    payload: CourseRecordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = CourseRecord(user_id=current_user.id, **payload.model_dump())
    db.add(record)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="같은 학기에 이미 등록된 과목입니다.",
        ) from exc
    db.refresh(record)
    return record


@router.get("/me", response_model=list[CourseRecordRead])
def list_my_course_records(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.scalars(
        select(CourseRecord)
        .where(CourseRecord.user_id == current_user.id)
        .order_by(CourseRecord.semester.desc(), CourseRecord.id.desc())
    ).all()


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course_record(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = db.scalar(
        select(CourseRecord).where(
            CourseRecord.id == record_id,
            CourseRecord.user_id == current_user.id,
        )
    )
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="수강 이력을 찾을 수 없습니다.")
    db.delete(record)
    db.commit()
