"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PASSWORD = "Sooners56";

export default function PasswordGate() {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("reca_auth") === "true") {
      router.replace("/dashboard");
    }
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value === PASSWORD) {
      localStorage.setItem("reca_auth", "true");
      router.replace("/dashboard");
    } else {
      setError(true);
      setValue("");
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Wordmark */}
        <div className="mb-12 text-center">
          <div className="font-heading text-3xl font-bold text-text-primary tracking-tight">
            RE Capital
          </div>
          <div className="font-heading text-3xl font-bold text-accent-gold tracking-tight">
            Academy
          </div>
          <div className="mt-3 text-text-secondary text-xs tracking-widest uppercase">
            Professional Real Estate Finance
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-8" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-text-secondary uppercase tracking-widest mb-2">
              Access Code
            </label>
            <input
              type="password"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(false);
              }}
              autoFocus
              className="w-full bg-bg-card border border-border text-text-primary px-4 py-3 text-sm outline-none focus:border-accent-gold font-mono tracking-widest placeholder:text-text-secondary placeholder:tracking-normal"
              placeholder="Enter access code"
            />
            {error && (
              <div className="mt-2 text-error-red text-xs">
                Incorrect access code. Please try again.
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-accent-gold text-bg-primary py-3 text-sm font-semibold uppercase tracking-widest hover:bg-accent-gold-light transition-colors"
          >
            Access Platform
          </button>
        </form>

        <div className="mt-12 border-t border-border pt-6 text-center">
          <div className="text-text-secondary text-xs">
            24 lessons across 3 levels. Institutional-grade real estate finance education.
          </div>
        </div>
      </div>
    </div>
  );
}
