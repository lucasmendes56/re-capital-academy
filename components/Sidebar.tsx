"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CURRICULUM } from "@/lib/curriculum";
import { useState } from "react";

interface SidebarProps {
  completedLessons?: Record<string, { completed: boolean }>;
}

export default function Sidebar({ completedLessons = {} }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({
    "level-1": true,
    "level-2": true,
    "level-3": true,
  });

  function toggleLevel(levelId: string) {
    setExpandedLevels((prev) => ({ ...prev, [levelId]: !prev[levelId] }));
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/formula-sheet", label: "Formula Sheet" },
    { href: "/glossary", label: "Glossary" },
    { href: "/progress", label: "Progress" },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-14" : "w-60"
      } flex-shrink-0 bg-bg-secondary border-r border-border flex flex-col transition-all duration-200 overflow-hidden`}
      style={{ minHeight: "100vh" }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        {!collapsed && (
          <Link href="/dashboard" className="block">
            <div className="font-heading text-accent-gold font-bold text-sm leading-tight tracking-wide">
              RE CAPITAL
              <br />
              <span className="text-text-secondary text-xs font-normal tracking-widest">ACADEMY</span>
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-text-secondary hover:text-text-primary p-1 flex-shrink-0"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            {collapsed ? (
              <path d="M3 8l5-5 1.4 1.4L6.8 8l2.6 2.6L8 12 3 8zm7-5l1.4 1.4L8.8 8l2.6 2.6L10 12 5 7l5-4z" />
            ) : (
              <path d="M13 8l-5 5-1.4-1.4L9.2 8 6.6 5.4 8 4l5 4zm-7 5L4.6 11.6 7.2 8 4.6 5.4 6 4l5 4-5 5z" />
            )}
          </svg>
        </button>
      </div>

      {/* Main nav */}
      <nav className="px-2 py-3 border-b border-border">
        {navLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-2 py-2 text-xs font-medium tracking-wide uppercase transition-colors mb-0.5 ${
                active
                  ? "text-accent-gold bg-bg-card border-l-2 border-accent-gold"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
              }`}
              title={collapsed ? link.label : undefined}
            >
              <span className="w-4 flex-shrink-0 text-center">
                {link.label === "Dashboard" && "■"}
                {link.label === "Formula Sheet" && "∑"}
                {link.label === "Glossary" && "≡"}
                {link.label === "Progress" && "◎"}
              </span>
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Curriculum tree */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {!collapsed && (
          <div className="text-xs text-text-secondary uppercase tracking-widest mb-3 px-2">
            Curriculum
          </div>
        )}
        {CURRICULUM.map((level) => (
          <div key={level.id} className="mb-2">
            <button
              onClick={() => toggleLevel(level.id)}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-semibold tracking-wider uppercase text-accent-gold hover:text-accent-gold-light transition-colors"
              title={collapsed ? `Level ${level.number}` : undefined}
            >
              <span className="flex-shrink-0 font-mono text-accent-gold">
                L{level.number}
              </span>
              {!collapsed && (
                <>
                  <span className="flex-1 text-left truncate">{level.title}</span>
                  <span className="text-text-secondary text-xs">
                    {expandedLevels[level.id] ? "▲" : "▼"}
                  </span>
                </>
              )}
            </button>

            {!collapsed && expandedLevels[level.id] && (
              <div className="ml-4">
                {level.lessons.map((lesson) => {
                  const lessonActive =
                    pathname === `/lesson/${lesson.id}` ||
                    pathname === `/quiz/${lesson.id}`;
                  const done = completedLessons[lesson.id]?.completed;

                  return (
                    <Link
                      key={lesson.id}
                      href={`/lesson/${lesson.id}`}
                      className={`flex items-center gap-2 py-1.5 px-2 text-xs transition-colors ${
                        lessonActive
                          ? "text-text-primary bg-bg-card border-l border-accent-gold"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      <span
                        className={`w-3 h-3 flex-shrink-0 border flex items-center justify-center text-xs ${
                          done
                            ? "border-success-green text-success-green"
                            : "border-border"
                        }`}
                      >
                        {done && "✓"}
                      </span>
                      <span className="truncate">
                        {lesson.number} {lesson.title}
                      </span>
                    </Link>
                  );
                })}
                <Link
                  href={`/capstone/${level.id}`}
                  className={`flex items-center gap-2 py-1.5 px-2 text-xs mt-1 border-t border-border transition-colors ${
                    pathname === `/capstone/${level.id}`
                      ? "text-accent-gold"
                      : "text-text-secondary hover:text-accent-gold"
                  }`}
                >
                  <span className="w-3 flex-shrink-0 text-accent-gold">◆</span>
                  <span>Capstone</span>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
