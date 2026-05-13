import uvicorn
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from models.schemas import AnalyzeRequest, StudyMaterial, ErrorResponse
from services.youtube import extract_video_id, get_transcript_text
from services.ai_engine import generate_study_material
import os

app = FastAPI(title="YouTube Study Mode API")

# CORS setup for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "api_key_configured": bool(os.getenv("GEMINI_API_KEY"))}

@app.post("/api/analyze", response_model=StudyMaterial)
async def analyze_video(request: AnalyzeRequest):
    try:
        video_id = extract_video_id(request.youtube_url)
        if not video_id:
            raise HTTPException(status_code=400, detail="Invalid YouTube URL")
        
        # Step 1: Get transcript
        transcript = get_transcript_text(video_id)
        
        # Step 2: Get AI generated study material
        result = generate_study_material(transcript, video_id)
        
        return result
        
    except Exception as e:
        # Log full trace for internal visibility if needed
        print(f"Error encountered: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
