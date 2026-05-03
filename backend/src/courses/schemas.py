from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CourseRecordCreate(BaseModel):
    course_number: str = Field(min_length=1, max_length=30)
    course_name: str = Field(min_length=1, max_length=150)
    completion_category: str = Field(min_length=1, max_length=30)
    credits: int = Field(ge=1)
    grade: str | None = Field(default=None, max_length=5)
    semester: str = Field(min_length=1, max_length=20)
    is_retake: bool = False


class CourseRecordRead(CourseRecordCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
