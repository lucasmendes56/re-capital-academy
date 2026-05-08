"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import AuthGuard from "@/components/AuthGuard";
import { getLessonById, getLevelById } from "@/lib/curriculum";
import { LESSON_CONTENT } from "@/lib/lessonContent";
import { getLessonCompletion, markLessonComplete } from "@/lib/progress";

// Simple markdown renderer (no external deps)
function renderMarkdown(md: string): string {
  return md
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^```[\w]*\n([\s\S]*?)^```/gm, "<pre><code>$1</code></pre>")
    .replace(/^\| (.+) \|$/gm, (line) => {
      const cells = line
        .split("|")
        .filter((c) => c.trim() !== "")
        .map((c) => c.trim());
      return `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, (block) => {
      const rows = block.split("\n").filter((r) => r.includes("<tr>"));
      if (rows.length === 0) return block;
      const header = rows[0].replace(/<td>/g, "<th>").replace(/<\/td>/g, "</th>");
      const body = rows.slice(2).join("\n"); // skip separator row
      return `<table><thead>${header}</thead><tbody>${body}</tbody></table>`;
    })
    .replace(/^---$/gm, "<hr>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    .replace(/^(\d+)\. (.+)$/gm, "<li>$2</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[htup]|<li|<pre|<table|<hr|<bl)(.+)$/gm, "<p>$1</p>");
}

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = getLessonById(lessonId);
  const level = lesson ? getLevelById(lesson.levelId) : null;
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Record<string, { completed: boolean }>>({});

  useEffect(() => {
    getLessonCompletion().then((data) => {
      setCompletedLessons(data);
      setCompleted(!!data[lessonId]?.completed);
    });
  }, [lessonId]);

  async function handleMarkComplete() {
    setMarking(true);
    await markLessonComplete(lessonId);
    setCompleted(true);
    setCompletedLessons((prev) => ({ ...prev, [lessonId]: { completed: true } }));
    setMarking(false);
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

  const content = LESSON_CONTENT[lessonId] || "";

  return (
    <AuthGuard>
      <AppLayout
        pageContext={`Lesson ${lesson.number}: ${lesson.title}`}
        completedLessons={completedLessons}
      >
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-text-secondary mb-6">
            <Link href="/dashboard" className="hover:text-accent-gold">
              Dashboard
            </Link>
            <span>/</span>
            {level && (
              <>
                <Link href={`/level/${level.id}`} className="hover:text-accent-gold">
                  Level {level.number}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-text-primary">Lesson {lesson.number}</span>
          </div>

          {/* Header */}
          <div className="mb-6 pb-6 border-b border-border">
            <div className="text-xs text-accent-gold uppercase tracking-widest mb-2">
              Lesson {lesson.number}
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-text-primary mb-3">
              {lesson.title}
            </h1>
            <p className="text-text-secondary text-sm leading-relaxed">{lesson.description}</p>

            {/* Topics */}
            <div className="flex flex-wrap gap-1.5 mt-4">
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

          {/* Content */}
          <div
            className="lesson-prose"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />

          {/* Footer actions */}
          <div className="mt-12 pt-6 border-t border-border flex flex-wrap items-center gap-3">
            <button
              onClick={handleMarkComplete}
              disabled={completed || marking}
              className={`text-xs font-semibold uppercase tracking-wider px-4 py-2 border transition-colors ${
                completed
                  ? "border-success-green text-success-green cursor-default"
                  : "border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-bg-primary"
              } disabled:cursor-not-allowed`}
            >
              {completed ? "Marked Complete" : marking ? "Saving..." : "Mark Complete"}
            </button>

            <Link
              href={`/quiz/${lesson.id}`}
              className="text-xs font-semibold uppercase tracking-wider px-4 py-2 bg-accent-gold text-bg-primary hover:bg-accent-gold-light transition-colors"
            >
              Take Quiz
            </Link>

            {/* Next lesson link */}
            {(() => {
              if (!level) return null;
              const idx = level.lessons.findIndex((l) => l.id === lesson.id);
              const next = level.lessons[idx + 1];
              if (!next) {
                return (
                  <Link
                    href={`/capstone/${level.id}`}
                    className="text-xs text-text-secondary hover:text-accent-gold border border-border hover:border-accent-gold px-4 py-2 transition-colors"
                  >
                    Level Capstone →
                  </Link>
                );
              }
              return (
                <Link
                  href={`/lesson/${next.id}`}
                  className="text-xs text-text-secondary hover:text-accent-gold border border-border hover:border-accent-gold px-4 py-2 transition-colors"
                >
                  Next: {next.title} →
                </Link>
              );
            })()}
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
