"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import AuthGuard from "@/components/AuthGuard";
import { CURRICULUM, getAllLessons } from "@/lib/curriculum";
import { getLessonCompletion, getQuizScores, getCapstoneScores } from "@/lib/progress";

export default function Dashboard() {
  const [completedLessons, setCompletedLessons] = useState<Record<string, { completed: boolean }>>({});
  const [quizScores, setQuizScores] = useState<Record<string, { bestScore: number; attempts: number }>>({});
  const [capstoneScores, setCapstoneScores] = useState<Record<string, { score: number }>>({});
  const [, setLoading] = useState(true);

  const allLessons = getAllLessons();
  const totalLessons = allLessons.length;

  useEffect(() => {
    async function load() {
      const [comp, quiz, capstone] = await Promise.all([
        getLessonCompletion(),
        getQuizScores(),
        getCapstoneScores(),
      ]);
      setCompletedLessons(comp);
      setQuizScores(quiz);
      setCapstoneScores(capstone);
      setLoading(false);
    }
    load();
  }, []);

  const completedCount = Object.values(completedLessons).filter((l) => l.completed).length;
  const completionPct = Math.round((completedCount / totalLessons) * 100);

  const quizScoreValues = Object.values(quizScores).map((q) => q.bestScore);
  const avgQuizScore =
    quizScoreValues.length > 0
      ? Math.round(quizScoreValues.reduce((a, b) => a + b, 0) / quizScoreValues.length)
      : 0;

  return (
    <AuthGuard>
      <AppLayout pageContext="the RE Capital Academy dashboard" completedLessons={completedLessons}>
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="text-xs text-accent-gold uppercase tracking-widest mb-1">
              RE Capital Academy
            </div>
            <h1 className="font-heading text-3xl font-bold text-text-primary">Dashboard</h1>
            <div className="text-text-secondary text-sm mt-1">
              Real estate finance education — institutional grade.
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              {
                label: "Completion",
                value: `${completionPct}%`,
                sub: `${completedCount} / ${totalLessons} lessons`,
              },
              {
                label: "Avg Quiz Score",
                value: avgQuizScore > 0 ? `${avgQuizScore}` : "—",
                sub: avgQuizScore > 0 ? "out of 100" : "No quizzes taken",
              },
              {
                label: "Quizzes Taken",
                value: `${quizScoreValues.length}`,
                sub: `of ${totalLessons} available`,
              },
              {
                label: "Capstones",
                value: `${Object.keys(capstoneScores).length}`,
                sub: "of 3 completed",
              },
            ].map((stat) => (
              <div key={stat.label} className="bg-bg-card border border-border p-4">
                <div className="text-xs text-text-secondary uppercase tracking-widest mb-1">
                  {stat.label}
                </div>
                <div className="font-mono text-2xl font-bold text-text-primary">{stat.value}</div>
                <div className="text-xs text-text-secondary mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Level progress */}
          <div className="space-y-6">
            {CURRICULUM.map((level) => {
              const levelComplete = level.lessons.filter(
                (l) => completedLessons[l.id]?.completed
              ).length;
              const levelPct = Math.round((levelComplete / level.lessons.length) * 100);

              return (
                <div key={level.id} className="bg-bg-card border border-border p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-xs text-accent-gold uppercase tracking-widest mb-1">
                        Level {level.number}
                      </div>
                      <div className="font-heading text-lg font-semibold text-text-primary">
                        {level.title}
                      </div>
                      <div className="text-xs text-text-secondary mt-0.5">{level.subtitle}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-text-primary">
                        {levelComplete}/{level.lessons.length}
                      </div>
                      <div className="text-xs text-text-secondary">lessons</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1 bg-bg-secondary mb-4">
                    <div
                      className="h-1 bg-accent-gold transition-all duration-500"
                      style={{ width: `${levelPct}%` }}
                    />
                  </div>

                  {/* Lesson grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    {level.lessons.map((lesson) => {
                      const done = completedLessons[lesson.id]?.completed;
                      const score = quizScores[lesson.id]?.bestScore;
                      return (
                        <Link
                          key={lesson.id}
                          href={`/lesson/${lesson.id}`}
                          className={`p-2 border text-xs transition-colors group ${
                            done
                              ? "border-success-green bg-success-green/5"
                              : "border-border hover:border-accent-gold"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-accent-gold">{lesson.number}</span>
                            {done && (
                              <span className="text-success-green text-xs">✓</span>
                            )}
                          </div>
                          <div className="text-text-secondary group-hover:text-text-primary truncate">
                            {lesson.title}
                          </div>
                          {score !== undefined && (
                            <div className="font-mono text-xs text-accent-gold mt-1">
                              {score}/100
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/level/${level.id}`}
                      className="text-xs text-text-secondary hover:text-accent-gold border border-border hover:border-accent-gold px-3 py-1.5 transition-colors"
                    >
                      Level Overview
                    </Link>
                    <Link
                      href={`/capstone/${level.id}`}
                      className="text-xs text-text-secondary hover:text-accent-gold border border-border hover:border-accent-gold px-3 py-1.5 transition-colors"
                    >
                      {capstoneScores[level.id]
                        ? `Capstone: ${capstoneScores[level.id].score}/100`
                        : "Take Capstone"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
