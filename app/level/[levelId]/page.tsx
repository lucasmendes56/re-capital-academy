"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import AuthGuard from "@/components/AuthGuard";
import { getLevelById } from "@/lib/curriculum";
import { useEffect, useState } from "react";
import { getLessonCompletion, getQuizScores } from "@/lib/progress";

export default function LevelPage() {
  const { levelId } = useParams<{ levelId: string }>();
  const level = getLevelById(levelId);
  const [completedLessons, setCompletedLessons] = useState<Record<string, { completed: boolean }>>({});
  const [quizScores, setQuizScores] = useState<Record<string, { bestScore: number; attempts: number }>>({});

  useEffect(() => {
    async function load() {
      const [comp, quiz] = await Promise.all([getLessonCompletion(), getQuizScores()]);
      setCompletedLessons(comp);
      setQuizScores(quiz);
    }
    load();
  }, []);

  if (!level) {
    return (
      <AuthGuard>
        <AppLayout pageContext="RE Capital Academy">
          <div className="p-8 text-text-secondary">Level not found.</div>
        </AppLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppLayout
        pageContext={`Level ${level.number}: ${level.title}`}
        completedLessons={completedLessons}
      >
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-2 text-xs text-accent-gold uppercase tracking-widest">
            Level {level.number}
          </div>
          <h1 className="font-heading text-3xl font-bold text-text-primary mb-1">{level.title}</h1>
          <p className="text-text-secondary text-sm mb-8">{level.subtitle}</p>

          <div className="space-y-3">
            {level.lessons.map((lesson) => {
              const done = completedLessons[lesson.id]?.completed;
              const score = quizScores[lesson.id];
              return (
                <div
                  key={lesson.id}
                  className={`bg-bg-card border p-5 transition-colors ${
                    done ? "border-success-green/40" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-accent-gold text-sm">
                          Lesson {lesson.number}
                        </span>
                        {done && (
                          <span className="text-success-green text-xs border border-success-green px-1.5 py-0.5 uppercase tracking-wider">
                            Complete
                          </span>
                        )}
                        {score && (
                          <span className="font-mono text-xs text-text-secondary">
                            Quiz: {score.bestScore}/100 ({score.attempts} attempt
                            {score.attempts !== 1 ? "s" : ""})
                          </span>
                        )}
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-text-primary mb-1">
                        {lesson.title}
                      </h3>
                      <p className="text-text-secondary text-xs leading-relaxed mb-3">
                        {lesson.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {lesson.topics.map((t) => (
                          <span
                            key={t}
                            className="text-xs text-text-secondary border border-border px-2 py-0.5"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Link
                        href={`/lesson/${lesson.id}`}
                        className="text-xs bg-accent-gold text-bg-primary font-semibold uppercase tracking-wider px-4 py-2 hover:bg-accent-gold-light transition-colors text-center"
                      >
                        {done ? "Review" : "Start"}
                      </Link>
                      <Link
                        href={`/quiz/${lesson.id}`}
                        className="text-xs border border-border text-text-secondary hover:text-text-primary hover:border-accent-gold uppercase tracking-wider px-4 py-2 transition-colors text-center"
                      >
                        Quiz
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <Link
              href={`/capstone/${level.id}`}
              className="inline-flex items-center gap-3 bg-bg-card border border-accent-gold/40 hover:border-accent-gold px-6 py-4 transition-colors"
            >
              <span className="text-accent-gold text-lg">◆</span>
              <div>
                <div className="text-sm font-semibold text-text-primary">
                  Level {level.number} Capstone
                </div>
                <div className="text-xs text-text-secondary">
                  Multi-part case study — graded by AI
                </div>
              </div>
            </Link>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
