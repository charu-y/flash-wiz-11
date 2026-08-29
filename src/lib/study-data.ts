export type Flashcard = { id: number; question: string; answer: string };

export type QuizQuestion = {
  id: number;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  correctAnswer: string;
};

export type StudySet = {
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  warnings: string[];
};

const STORAGE_KEY = "flashgenius:study-set";

export function saveStudySet(set: StudySet) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(set));
}

export function loadStudySet(): StudySet | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StudySet;
  } catch {
    return null;
  }
}
