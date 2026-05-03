from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.auth.router import get_current_user
from src.database import get_db
from src.graduation.schemas import GraduationProgressRead, GraduationRecommendationRead
from src.models import User
from src.services.graduation import build_recommendations, calculate_progress

router = APIRouter(prefix="/api/graduation", tags=["graduation"])


@router.get("/progress", response_model=GraduationProgressRead)
def get_graduation_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return calculate_progress(db, current_user)


@router.get("/recommend", response_model=GraduationRecommendationRead)
def get_graduation_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return build_recommendations(db, current_user)
