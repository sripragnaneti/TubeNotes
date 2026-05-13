from pydantic import BaseModel, HttpUrl
from typing import List, Optional

class AnalyzeRequest(BaseModel):
    youtube_url: str

class Chapter(BaseModel):
    timestamp: str
    title: str
    summary: str

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: int  # index of correct option
    explanation: str

class Flashcard(BaseModel):
    front: str
    back: str

class StudyMaterial(BaseModel):
    video_id: str
    title: Optional[str] = "Untitled Video"
    summary: str
    chapters: List[Chapter]
    quiz: List[QuizQuestion]
    flashcards: List[Flashcard]

class ErrorResponse(BaseModel):
    error: str
