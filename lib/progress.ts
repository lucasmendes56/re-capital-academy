import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface LessonCompletion {
  completed: boolean;
  completedAt?: number;
  timeSpent?: number;
}

export interface QuizScore {
  bestScore: number;
  attempts: number;
  lastAttempt: number;
}

export interface CapstoneScore {
  score: number;
  submittedAt: number;
  feedback: string;
}

export async function getLessonCompletion(): Promise<Record<string, LessonCompletion>> {
  try {
    const ref = doc(db, "progress", "lesson_completion");
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as Record<string, LessonCompletion>) : {};
  } catch {
    return {};
  }
}

export async function markLessonComplete(lessonId: string): Promise<void> {
  const ref = doc(db, "progress", "lesson_completion");
  await setDoc(ref, { [lessonId]: { completed: true, completedAt: Date.now() } }, { merge: true });
}

export async function getQuizScores(): Promise<Record<string, QuizScore>> {
  try {
    const ref = doc(db, "progress", "quiz_scores");
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as Record<string, QuizScore>) : {};
  } catch {
    return {};
  }
}

export async function saveQuizScore(lessonId: string, score: number): Promise<void> {
  const ref = doc(db, "progress", "quiz_scores");
  const snap = await getDoc(ref);
  const existing = snap.exists() ? (snap.data() as Record<string, QuizScore>) : {};
  const prev = existing[lessonId];
  await setDoc(
    ref,
    {
      [lessonId]: {
        bestScore: prev ? Math.max(prev.bestScore, score) : score,
        attempts: prev ? prev.attempts + 1 : 1,
        lastAttempt: Date.now(),
      },
    },
    { merge: true }
  );
}

export async function getCapstoneScores(): Promise<Record<string, CapstoneScore>> {
  try {
    const ref = doc(db, "progress", "capstone_scores");
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as Record<string, CapstoneScore>) : {};
  } catch {
    return {};
  }
}

export async function saveCapstoneScore(levelId: string, score: number, feedback: string): Promise<void> {
  const ref = doc(db, "progress", "capstone_scores");
  await setDoc(ref, { [levelId]: { score, feedback, submittedAt: Date.now() } }, { merge: true });
}
