"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import AuthGuard from "@/components/AuthGuard";
import { CURRICULUM, getAllLessons } from "@/lib/curriculum";
import { getLessonCompletion, getQuizScores, getCapstoneScores } from "@/lib/progress";

export default function ProgressPage() {
  const [completedLessons, setCompletedLessons] = useState<Record<string, { completed: boolean; completedAt?: number }>>({});
  const [quizScores, setQuizScores] = useState<Record<string, { bestScore: number; attempts: number; lastAttempt: number }>>({});
  const [capstoneScores, setCapstoneScores] = useState<Record<string, { score: number; submittedAt: number }>>({});
  const [loading, setLoading] = useState(true);

  const allLessons = getAllLessons();

  useEffect(() => {
    async function load() {
      const [comp, quiz, caps] = await Promise.all([
        getLessonCompletion(),
        getQuizScores(),
        getCapstoneScores(),
      ]);
      setCompletedLessons(comp as Record<string, { completed: boolean; completedAt?: number }>);
      setQuizScores(quiz as Record<string, { bestScore: number; attempts: number; lastAttempt: number }>);
      setCapstoneScores(caps as Record<string, { score: number; submittedAt: number }>);
      setLoading(false);
    }
    load();
  }, []);

  const completedCount = Object.values(completedLessons).filter((l) => l.completed).length;
  const totalLessons = allLessons.length;
  const quizScoreValues = Object.values(quizScores).map((q) => q.bestScore);
  const avgScore =
    quizScoreValues.length > 0
      ? Math.round(quizScoreValues.reduce((a, b) => a + b, 0) / quizScoreValues.length)
      : 0;

  return (
    <AuthGuard>
      <AppLayout pageContext="your progress dashboard" completedLessons={completedLessons}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-2 text-xs text-accent-gold uppercase tracking-widest">Analytics</div>
          <h1 className="font-heading text-3xl font-bold text-text-primary mb-8">Progress</h1>

          {loading ? (
            <div className="text-text-secondary text-sm">Loading progress data...</div>
          ) : (
            <>
              {/* Summary stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
                {[
                  { label: "Lessons Complete", value: `${completedCount}/${totalLessons}`, sub: `${Math.round((completedCount / totalLessons) * 100)}% of curriculum` },
                  { label: "Quizzes Taken", value: `${quizScoreValues.length}`, sub: `of ${totalLessons} available` },
                  { label: "Average Score", value: avgScore > 0 ? `${avgScore}/100` : "—", sub: avgScore > 0 ? `on ${quizScoreValues.length} quiz${quizScoreValues.length !== 1 ? "zes" : ""}` : "No quizzes taken" },
                  { label: "Capstones Done", value: `${Object.keys(capstoneScores).length}/3`, sub: "case studies graded" },
                ].map((s) => (
                  <div key={s.label} className="bg-bg-card border border-border p-4">
                    <div className="text-xs text-text-secondary uppercase tracking-widest mb-1">{s.label}</div>
                    <div className="font-mono text-xl font-bold text-text-primary">{s.value}</div>
                    <div className="text-xs text-text-secondary mt-1">{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Per-level breakdown */}
              {CURRICULUM.map((level) => {
                const levelDone = level.lessons.filter((l) => completedLessons[l.id]?.completed).length;
                return (
                  <div key={level.id} className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="font-heading text-lg font-semibold text-text-primary">
                        Level {level.number}: {level.title}
                      </h2>
                      <span className="font-mono text-xs text-text-secondary">
                        {levelDone}/{level.lessons.length}
                      </span>
                    </div>

                    <div className="h-1 bg-bg-secondary mb-4">
                      <div
                        className="h-1 bg-accent-gold"
                        style={{ width: `${(levelDone / level.lessons.length) * 100}%` }}
                      />
                    </div>

                    <div className="space-y-1">
                      {level.lessons.map((lesson) => {
                        const done = completedLessons[lesson.id]?.completed;
                        const completedAt = completedLessons[lesson.id]?.completedAt;
                        const score = quizScores[lesson.id];
                        return (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between bg-bg-card border border-border px-4 py-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className={`w-4 h-4 flex-shrink-0 border flex items-center justify-center text-xs ${
                                  done
                                    ? "border-success-green text-success-green"
                                    : "border-border"
                                }`}
                              >
                                {done && "✓"}
                              </span>
                              <div className="min-w-0">
                                <div className="text-xs text-text-primary truncate">
                                  <span className="font-mono text-accent-gold mr-2">
                                    {lesson.number}
                                  </span>
                                  {lesson.title}
                                </div>
                                {done && completedAt && (
                                  <div className="text-xs text-text-secondary">
                                    Completed {new Date(completedAt).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                              {score ? (
                                <div className="text-right">
                                  <div
                                    className={`font-mono text-xs ${
                                      score.bestScore >= 70
                                        ? "text-success-green"
                                        : "text-error-red"
                                    }`}
                                  >
                                    {score.bestScore}/100
                                  </div>
                                  <div className="text-xs text-text-secondary">
                                    {score.attempts} attempt{score.attempts !== 1 ? "s" : ""}
                                  </div>
                                </div>
                              ) : (
                                <Link
                                  href={`/quiz/${lesson.id}`}
                                  className="text-xs text-text-secondary hover:text-accent-gold border border-border hover:border-accent-gold px-2 py-1 transition-colors"
                                >
                                  Take Quiz
                                </Link>
                              )}
                              <Link
                                href={`/lesson/${lesson.id}`}
                                className="text-xs text-text-secondary hover:text-accent-gold"
                              >
                                {done ? "Review" : "Start"} →
                              </Link>
                            </div>
                          </div>
                        );
                      })}

                      {/* Capstone row */}
                      <div className="flex items-center justify-between bg-bg-card border border-border border-l-2 border-l-accent-gold/40 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-accent-gold text-xs">◆</span>
                          <span className="text-xs text-text-primary">
                            Level {level.number} Capstone
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          {capstoneScores[level.id] ? (
                            <span
                              className={`font-mono text-xs ${
                                capstoneScores[level.id].score >= 70
                                  ? "text-success-green"
                                  : "text-error-red"
                              }`}
                            >
                              {capstoneScores[level.id].score}/100
                            </span>
                          ) : null}
                          <Link
                            href={`/capstone/${level.id}`}
                            className="text-xs text-text-secondary hover:text-accent-gold border border-border hover:border-accent-gold px-2 py-1 transition-colors"
                          >
                            {capstoneScores[level.id] ? "Retake" : "Start"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Score history */}
              {quizScoreValues.length > 0 && (
                <div className="mt-4">
                  <h2 className="font-heading text-lg font-semibold text-text-primary mb-3">
                    Quiz Score History
                  </h2>
                  <div className="bg-bg-card border border-border p-4">
                    <div className="space-y-2">
                      {Object.entries(quizScores)
                        .sort(([, a], [, b]) => b.lastAttempt - a.lastAttempt)
                        .map(([lessonId, score]) => {
                          const lesson = allLessons.find((l) => l.id === lessonId);
                          return (
                            <div
                              key={lessonId}
                              className="flex items-center justify-between py-2 border-b border-border last:border-0"
                            >
                              <div className="text-xs text-text-secondary">
                                <span className="font-mono text-accent-gold mr-2">{lessonId}</span>
                                {lesson?.title}
                              </div>
                              <div className="flex items-center gap-4">
                                <span
                                  className={`font-mono text-xs ${
                                    score.bestScore >= 70 ? "text-success-green" : "text-error-red"
                                  }`}
                                >
                                  {score.bestScore}/100
                                </span>
                                <span className="text-xs text-text-secondary">
                                  {new Date(score.lastAttempt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
