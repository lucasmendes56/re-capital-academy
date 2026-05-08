"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import AuthGuard from "@/components/AuthGuard";
import { getLessonById } from "@/lib/curriculum";
import { getQuizScores, saveQuizScore, markLessonComplete, getLessonCompletion } from "@/lib/progress";

interface Question {
  type: "multiple_choice" | "calculation" | "short_answer";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options?: string[];
  correctAnswer?: string;
}

interface GradedQuestion {
  question: string;
  userAnswer: string;
  score: number;
  maxScore: number;
  feedback: string;
  correctAnswer?: string;
}

type Phase = "info" | "loading_questions" | "quiz" | "submitting" | "results";

export default function QuizPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = getLessonById(lessonId);
  const [phase, setPhase] = useState<Phase>("info");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [gradedResults, setGradedResults] = useState<GradedQuestion[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [previousBest, setPreviousBest] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Record<string, { completed: boolean }>>({});

  useEffect(() => {
    async function load() {
      const [scores, comp] = await Promise.all([getQuizScores(), getLessonCompletion()]);
      if (scores[lessonId]) {
        setPreviousBest(scores[lessonId].bestScore);
        setAttempts(scores[lessonId].attempts);
      }
      setCompletedLessons(comp);
    }
    load();
  }, [lessonId]);

  async function generateQuestions() {
    setPhase("loading_questions");
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });
      const data = await res.json();
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(""));
      setPhase("quiz");
    } catch {
      setPhase("info");
      alert("Failed to generate quiz questions. Please try again.");
    }
  }

  async function submitQuiz() {
    setPhase("submitting");
    try {
      const res = await fetch("/api/grade-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, questions, answers }),
      });
      const data = await res.json();
      setGradedResults(data.results);
      setTotalScore(data.totalScore);

      await saveQuizScore(lessonId, data.totalScore);
      if (data.totalScore >= 70) {
        await markLessonComplete(lessonId);
        setCompletedLessons((prev) => ({ ...prev, [lessonId]: { completed: true } }));
      }
      setPhase("results");
    } catch {
      setPhase("quiz");
      alert("Failed to grade quiz. Please try again.");
    }
  }

  if (!lesson) {
    return (
      <AuthGuard>
        <AppLayout pageContext="RE Capital Academy">
          <div className="p-8 text-text-secondary">Lesson not found.</div>
        </AppLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppLayout
        pageContext={`Quiz — Lesson ${lesson.number}: ${lesson.title}`}
        completedLessons={completedLessons}
      >
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-6 pb-4 border-b border-border">
            <div className="text-xs text-accent-gold uppercase tracking-widest mb-1">
              Quiz — Lesson {lesson.number}
            </div>
            <h1 className="font-heading text-2xl font-bold text-text-primary">{lesson.title}</h1>
            {previousBest !== null && (
              <div className="mt-2 text-xs text-text-secondary">
                Best score:{" "}
                <span className="font-mono text-accent-gold">{previousBest}/100</span> —{" "}
                {attempts} attempt{attempts !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* Info phase */}
          {phase === "info" && (
            <div>
              <div className="bg-bg-card border border-border p-6 mb-6">
                <h2 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">
                  Quiz Format
                </h2>
                <ul className="text-xs text-text-secondary space-y-2">
                  <li>— 5 questions: 2 multiple choice, 2 calculation, 1 short answer</li>
                  <li>— Difficulty: 1 easy, 2 medium, 2 hard</li>
                  <li>— Scored out of 100 with partial credit on calculations</li>
                  <li>— Score 70+ to mark this lesson complete</li>
                  <li>— Questions are AI-generated based on lesson content</li>
                  <li>— Unlimited retakes — your best score is saved</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={generateQuestions}
                  className="bg-accent-gold text-bg-primary text-sm font-semibold uppercase tracking-wider px-6 py-3 hover:bg-accent-gold-light transition-colors"
                >
                  Generate Quiz Questions
                </button>
                <Link
                  href={`/lesson/${lesson.id}`}
                  className="text-sm text-text-secondary hover:text-text-primary border border-border hover:border-accent-gold px-6 py-3 transition-colors"
                >
                  Review Lesson First
                </Link>
              </div>
            </div>
          )}

          {/* Loading phase */}
          {phase === "loading_questions" && (
            <div className="flex items-center gap-3 py-12">
              <div className="w-4 h-4 border border-accent-gold border-t-transparent animate-spin" />
              <span className="text-text-secondary text-sm">
                Generating quiz questions based on lesson content...
              </span>
            </div>
          )}

          {/* Quiz phase */}
          {phase === "quiz" && (
            <div>
              <div className="space-y-6">
                {questions.map((q, i) => (
                  <div key={i} className="bg-bg-card border border-border p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-accent-gold text-sm">Q{i + 1}</span>
                      <span
                        className={`text-xs uppercase tracking-wider border px-1.5 py-0.5 ${
                          q.difficulty === "easy"
                            ? "border-success-green text-success-green"
                            : q.difficulty === "medium"
                            ? "border-accent-gold text-accent-gold"
                            : "border-error-red text-error-red"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="text-xs text-text-secondary capitalize">
                        {q.type.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-text-primary text-sm leading-relaxed mb-4">{q.question}</p>

                    {q.type === "multiple_choice" && q.options ? (
                      <div className="space-y-2">
                        {q.options.map((opt, j) => (
                          <label
                            key={j}
                            className={`flex items-start gap-3 p-3 border cursor-pointer transition-colors ${
                              answers[i] === opt
                                ? "border-accent-gold bg-accent-gold/5"
                                : "border-border hover:border-text-secondary"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`q${i}`}
                              value={opt}
                              checked={answers[i] === opt}
                              onChange={(e) => {
                                const updated = [...answers];
                                updated[i] = e.target.value;
                                setAnswers(updated);
                              }}
                              className="mt-0.5 flex-shrink-0 accent-[#C9A84C]"
                            />
                            <span className="text-xs text-text-primary leading-relaxed">{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <textarea
                        value={answers[i]}
                        onChange={(e) => {
                          const updated = [...answers];
                          updated[i] = e.target.value;
                          setAnswers(updated);
                        }}
                        rows={q.type === "short_answer" ? 4 : 2}
                        placeholder={
                          q.type === "calculation"
                            ? "Show your work and provide the final answer..."
                            : "Explain your thinking with specific numbers and reasoning..."
                        }
                        className="w-full bg-bg-secondary border border-border text-text-primary text-xs px-3 py-2 outline-none focus:border-accent-gold resize-none placeholder:text-text-secondary font-mono"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={submitQuiz}
                  disabled={answers.some((a) => !a.trim())}
                  className="bg-accent-gold text-bg-primary text-sm font-semibold uppercase tracking-wider px-6 py-3 hover:bg-accent-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </button>
                <span className="text-xs text-text-secondary self-center">
                  {answers.filter((a) => a.trim()).length}/{questions.length} answered
                </span>
              </div>
            </div>
          )}

          {/* Submitting phase */}
          {phase === "submitting" && (
            <div className="flex items-center gap-3 py-12">
              <div className="w-4 h-4 border border-accent-gold border-t-transparent animate-spin" />
              <span className="text-text-secondary text-sm">Grading your responses...</span>
            </div>
          )}

          {/* Results phase */}
          {phase === "results" && (
            <div>
              {/* Score summary */}
              <div
                className={`border p-6 mb-6 ${
                  totalScore >= 70
                    ? "border-success-green bg-success-green/5"
                    : "border-error-red bg-error-red/5"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold uppercase tracking-wider text-text-primary">
                    {totalScore >= 70 ? "Passed" : "Not Yet Passed"}
                  </div>
                  <div
                    className={`font-mono text-3xl font-bold ${
                      totalScore >= 70 ? "text-success-green" : "text-error-red"
                    }`}
                  >
                    {totalScore}/100
                  </div>
                </div>
                {totalScore >= 70 && (
                  <div className="text-xs text-success-green">
                    Lesson marked complete. Score saved to your progress.
                  </div>
                )}
                {totalScore < 70 && (
                  <div className="text-xs text-text-secondary">
                    Score 70 or above to mark this lesson complete. Review the feedback below and
                    retake.
                  </div>
                )}
              </div>

              {/* Per-question feedback */}
              <div className="space-y-4 mb-6">
                {gradedResults.map((result, i) => (
                  <div key={i} className="bg-bg-card border border-border p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-accent-gold text-sm">Q{i + 1}</span>
                      <span
                        className={`font-mono text-sm font-bold ${
                          result.score === result.maxScore
                            ? "text-success-green"
                            : result.score > 0
                            ? "text-accent-gold"
                            : "text-error-red"
                        }`}
                      >
                        {result.score}/{result.maxScore}
                      </span>
                    </div>
                    <p className="text-text-primary text-xs mb-3">{result.question}</p>
                    <div className="text-xs text-text-secondary mb-2">
                      <span className="text-accent-gold uppercase tracking-wider">
                        Your answer:{" "}
                      </span>
                      {result.userAnswer}
                    </div>
                    {result.correctAnswer && (
                      <div className="text-xs text-text-secondary mb-2">
                        <span className="text-success-green uppercase tracking-wider">
                          Correct:{" "}
                        </span>
                        {result.correctAnswer}
                      </div>
                    )}
                    <div className="text-xs text-text-secondary border-t border-border pt-3 mt-3 leading-relaxed">
                      <span className="text-text-primary uppercase tracking-wider">
                        Instructor Feedback:{" "}
                      </span>
                      {result.feedback}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setPhase("info");
                    setQuestions([]);
                    setAnswers([]);
                    setGradedResults([]);
                    setTotalScore(0);
                    getQuizScores().then((scores) => {
                      if (scores[lessonId]) {
                        setPreviousBest(scores[lessonId].bestScore);
                        setAttempts(scores[lessonId].attempts);
                      }
                    });
                  }}
                  className="text-sm font-semibold uppercase tracking-wider px-5 py-2.5 border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-bg-primary transition-colors"
                >
                  Retake Quiz
                </button>
                <Link
                  href={`/lesson/${lesson.id}`}
                  className="text-sm font-semibold uppercase tracking-wider px-5 py-2.5 border border-border text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors"
                >
                  Review Lesson
                </Link>
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
