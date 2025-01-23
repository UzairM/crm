from fastapi import FastAPI

app = FastAPI(
    title="AI Service",
    description="AI-powered customer service capabilities for the Finance CRM",
    version="1.0.0",
)

@app.get("/")
async def root():
    return {"message": "AI Service is running"} 