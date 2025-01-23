from fastapi import FastAPI
from app.api.routes import health

app = FastAPI(
    title="AI Service",
    description="AI Service for Finance CRM",
    version="1.0.0"
)

# Include routers
app.include_router(health.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 