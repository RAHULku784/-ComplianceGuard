from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.ai_schema import AIChatRequest, AIChatResponse

from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db
from app.services.ai_service import (
    get_risk_analysis,
    generate_ai_response
)


router = APIRouter(
    prefix="/ai",
    tags=["AI Assistant"]
)


@router.get("/risk-analysis")
def risk_analysis(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_risk_analysis(db)

@router.post(
    "/chat",
    response_model=AIChatResponse
)
def ai_chat(
    request: AIChatRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return generate_ai_response(
        db,
        request.message
    )