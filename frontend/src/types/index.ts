export interface Chapter {
  timestamp: string;
  title: string;
  summary: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface StudyMaterial {
  video_id: string;
  summary: string;
  chapters: Chapter[];
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
}
