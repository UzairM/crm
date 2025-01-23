from fastapi import APIRouter

router = APIRouter(tags=["Health"])

@router.get("/ping")
async def ping():
    """
    Health check endpoint
    """
    return {"message": "AI Service up!"} 