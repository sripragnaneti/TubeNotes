import os
import google.generativeai as genai
import json
from dotenv import load_dotenv
from models.schemas import StudyMaterial

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

def generate_study_material(transcript: str, video_id: str) -> StudyMaterial:
    """
    Passes the transcript to Gemini 1.5 Flash to extract structured study material.
    """
    if not API_KEY:
        raise Exception("GEMINI_API_KEY environment variable not set.")

    model = genai.GenerativeModel(
        model_name='gemini-2.5-flash',
        generation_config={
            "response_mime_type": "application/json",
        }
    )

    prompt = f"""
    Analyze the following video transcript and generate a structured study toolkit in JSON format.
    
    Requirements:
    1. A concise comprehensive summary of the whole video.
    2. A list of major chapters with precise start times parsed from the timestamps in the transcript.
    3. A quiz comprising 5 multiple-choice questions covering the core concepts.
    4. A set of 5 flashcards for review (key terms on front, definitions/context on back).
    
    Output exactly in the following JSON structure:
    {{
      "summary": "Main summary string",
      "chapters": [
        {{"timestamp": "MM:SS", "title": "Chapter Title", "summary": "Mini chapter summary"}}
      ],
      "quiz": [
        {{"question": "Question string", "options": ["A", "B", "C", "D"], "correct_answer": 0, "explanation": "Why it's correct"}}
      ],
      "flashcards": [
        {{"front": "Key concept", "back": "Description"}}
      ]
    }}
    
    Transcript:
    {transcript}
    """

    try:
        response = model.generate_content(prompt)
        # Clean and parse response
        data = json.loads(response.text)
        
        # Add standard fields
        return StudyMaterial(
            video_id=video_id,
            summary=data.get("summary", "No summary generated"),
            chapters=data.get("chapters", []),
            quiz=data.get("quiz", []),
            flashcards=data.get("flashcards", [])
        )
        
    except Exception as e:
        raise Exception(f"AI analysis failed: {str(e)}")
