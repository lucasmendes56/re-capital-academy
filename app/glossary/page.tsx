"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import AuthGuard from "@/components/AuthGuard";
import { GLOSSARY } from "@/lib/glossary";

export default function GlossaryPage() {
  const [search, setSearch] = useState("");

  const filtered = GLOSSARY.filter(
    (item) =>
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.definition.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.term.localeCompare(b.term));

  const letters = Array.from(new Set(filtered.map((t) => t.term[0].toUpperCase()))).sort();

  return (
    <AuthGuard>
      <AppLayout pageContext="the Glossary — definitions for all real estate finance terminology">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-2 text-xs text-accent-gold uppercase tracking-widest">Reference</div>
          <h1 className="font-heading text-3xl font-bold text-text-primary mb-1">Glossary</h1>
          <p className="text-text-secondary text-sm mb-6">
            {GLOSSARY.length} real estate finance terms with definitions and examples.
          </p>

          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terms..."
              className="w-full max-w-md bg-bg-card border border-border text-text-primary px-4 py-2.5 text-sm outline-none focus:border-accent-gold placeholder:text-text-secondary"
            />
            {search && (
              <div className="mt-1 text-xs text-text-secondary">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* Letter index */}
          {!search && (
            <div className="flex flex-wrap gap-1 mb-6">
              {letters.map((l) => (
                <a
                  key={l}
                  href={`#letter-${l}`}
                  className="text-xs font-mono border border-border px-2 py-1 text-text-secondary hover:text-accent-gold hover:border-accent-gold transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
          )}

          {/* Terms */}
          <div className="space-y-1">
            {letters.map((letter) => {
              const terms = filtered.filter((t) => t.term[0].toUpperCase() === letter);
              return (
                <div key={letter} id={`letter-${letter}`}>
                  <div className="text-xs text-accent-gold font-mono uppercase tracking-widest py-2 mt-4 border-b border-border mb-2">
                    {letter}
                  </div>
                  {terms.map((term) => (
                    <div
                      key={term.term}
                      className="bg-bg-card border border-border p-4 mb-2 hover:border-border/80 transition-colors"
                    >
                      <div className="text-sm font-semibold text-text-primary mb-2">
                        {term.term}
                      </div>
                      <div className="text-xs text-text-secondary leading-relaxed mb-2">
                        {term.definition}
                      </div>
                      <div className="text-xs text-text-secondary border-t border-border pt-2 mt-2">
                        <span className="text-accent-gold/80">Example: </span>
                        {term.example}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-text-secondary text-sm py-8">
              No terms match &quot;{search}&quot;.
            </div>
          )}
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
