"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import AuthGuard from "@/components/AuthGuard";
import { getLevelById } from "@/lib/curriculum";
import { getCapstoneScores, saveCapstoneScore, getLessonCompletion } from "@/lib/progress";

const CAPSTONE_PROMPTS: Record<
  string,
  { title: string; scenario: string; questions: { label: string; prompt: string }[] }
> = {
  "level-1": {
    title: "Level 1 Capstone: Multifamily Acquisition Analysis",
    scenario: `You are evaluating the following multifamily acquisition opportunity:

PROPERTY: Parkview Commons — 80-unit garden-style apartment complex
LOCATION: Suburban market, 15 miles from CBD
ASKING PRICE: $11,200,000

INCOME (Current Year):
- Average occupied rent: $1,050/month
- Occupancy: 94% (75 units occupied, 5 vacant)
- Other income (parking, laundry): $18,000/year

OPERATING EXPENSES (Annual):
- Property taxes: $92,000
- Insurance: $28,000
- Utilities (common area): $36,000
- Repairs & maintenance: $58,000
- Property management (5% of EGI): TBD
- Payroll: $72,000
- Marketing & admin: $24,000
- Reserves: $28,000

DEBT TERMS AVAILABLE: 65% LTV, 6.25% interest rate, 30-year amortization, 2 years IO`,
    questions: [
      {
        label: "Q1: Calculate NOI",
        prompt:
          "Calculate Potential Gross Rent, Vacancy Loss, Effective Gross Income (including other income), Operating Expenses (including the 5% management fee on your calculated EGI), and Net Operating Income. Show all work.",
      },
      {
        label: "Q2: Implied Cap Rate",
        prompt:
          "Based on the asking price and your calculated NOI, what is the implied cap rate? Is this aggressive, fair, or conservative for a suburban garden-style multifamily in today's market? Explain your reasoning.",
      },
      {
        label: "Q3: Debt Sizing & Metrics",
        prompt:
          "Calculate the loan amount at 65% LTV. Calculate annual IO debt service. Calculate DSCR and Debt Yield. Does this deal pass typical lender tests? Explain.",
      },
      {
        label: "Q4: Cash-on-Cash Return",
        prompt:
          "Calculate the equity required (down payment plus 1% closing costs on the purchase price). Calculate Year 1 levered cash flow (NOI minus IO debt service). What is the Year 1 Cash-on-Cash return?",
      },
      {
        label: "Q5: 5-Year Equity Multiple (Assumptions Provided)",
        prompt:
          "Assume NOI grows 3%/year, IO debt service for 2 years then amortizing (use same annual payment as IO × 1.18 as approximation). Exit at Year 5 at a 5.75% cap rate. Estimate total cash flows received over 5 years and net sale proceeds (exit value minus approximate loan payoff of $6.8M minus 2% selling costs). Calculate equity multiple.",
      },
      {
        label: "Q6: Risk Assessment",
        prompt:
          "Identify the top three risks in this deal. For each risk, explain what could go wrong and how you would stress-test it.",
      },
      {
        label: "Q7: Go / No-Go Recommendation",
        prompt:
          "Based on your analysis, would you recommend proceeding with this acquisition at $11,200,000? State your recommendation clearly and support it with the numbers you've calculated. Be direct.",
      },
    ],
  },
  "level-2": {
    title: "Level 2 Capstone: Value-Add Acquisition Underwriting",
    scenario: `DEAL MEMO: Riverside Commons Apartments

PROPERTY: 96-unit garden-style multifamily complex, built 1987
LOCATION: Mid-size Sunbelt metro, growing employment base
ASKING PRICE: $14,400,000

CURRENT STATUS (Year 0):
- Avg unit rent: $1,100/month (market for renovated comps: $1,375/month)
- Occupancy: 91% (87 units occupied)
- NOI current: $620,000
- Condition: Dated but functional; kitchens/baths original

RENOVATION PLAN:
- Budget: $1,920,000 total ($20,000/unit × 96 units)
- Timeline: 24 months (4 units/month)
- Projected rent premium on renovated units: $275/month
- Renovation disruption: 10% additional vacancy during renovation period

FINANCING:
- Bridge Loan: 70% LTV on as-is value, SOFR+300 (assume 8.5% all-in), IO, 2-year term + 1-year extension
- Permanent Loan (Year 3): 65% LTV on stabilized value, 6.5% fixed, 30-year amortization`,
    questions: [
      {
        label: "Q1: Current NOI",
        prompt:
          "Calculate current NOI. PGR = 96 units × $1,100 × 12 months. Vacancy at current 9%. Other income: $24,000/year. OpEx: 42% of EGI. Show all steps.",
      },
      {
        label: "Q2: Stabilized NOI (Post-Renovation)",
        prompt:
          "Calculate projected stabilized NOI assuming 100% of units renovated at $1,375/month, 5% stabilized vacancy, same other income, and OpEx at 40% of EGI (more efficient at higher rents). How much NOI growth does this represent?",
      },
      {
        label: "Q3: Bridge Loan & Debt Service",
        prompt:
          "Calculate the bridge loan amount (70% LTV on as-is value using your Year 0 NOI and a 6.5% cap rate assumption for as-is value). Calculate IO debt service at 8.5%. What is the DSCR on current NOI? Is there positive cash flow during renovation?",
      },
      {
        label: "Q4: 5-Year Cash Flow Model",
        prompt:
          "Model Year 1-2 (renovation period: average blend of renovated/unrenovated units, elevated vacancy of 14%), Year 3 (stabilization, switch to permanent financing), Year 4-5 (stable). Show NOI, debt service, and levered cash flow for each year.",
      },
      {
        label: "Q5: Exit & IRR",
        prompt:
          "Exit at end of Year 5. Assume 5.5% exit cap rate on Year 5 NOI. Permanent loan balance at Year 5: approximately $8.2M. Calculate equity invested (down payment + closing costs + renovation budget as equity — assume you fund renovation with equity, not the bridge loan). Calculate IRR and equity multiple.",
      },
      {
        label: "Q6: Stress Test",
        prompt:
          "Model a downside scenario: renovation costs 20% over budget, rent premium only $200/month (not $275), exit cap rate 6.0%. How does IRR change? Does the deal still work?",
      },
      {
        label: "Q7: Investment Decision",
        prompt:
          "Write a 150-word investment memo recommendation. Address: (1) Does this deal meet a value-add return hurdle of 14% levered IRR? (2) What is the biggest execution risk? (3) Go or no-go, and why?",
      },
    ],
  },
  "level-3": {
    title: "Level 3 Capstone: LP Fund Analysis",
    scenario: `FUND OVERVIEW: Meridian Value-Add Real Estate Fund III

MANAGER: Meridian Capital Partners (3 prior funds, Fund II returned 1.6x net / 12.8% net IRR)
STRATEGY: Value-add multifamily and industrial, primary US markets
TARGET: $150,000,000 equity raise (hard cap $175M)
INVESTMENT PERIOD: 3 years | FUND LIFE: 8 years

FEE STRUCTURE:
- Management Fee: 1.75% of committed capital during investment period (Years 1-3)
- Management Fee: 1.25% of invested capital thereafter (Years 4-8)
- Preferred Return: 8% cumulative, non-compounding
- GP Catch-Up: 100% to GP until GP has received 20% of total profits
- Carried Interest: 20% above 8% pref

GP CO-INVEST: 1.5% ($2.25M)

SAMPLE DEAL IN FUND:
- 120-unit multifamily, $18.5M purchase price
- Current NOI: $920,000 (4.97% cap)
- Value-add: $2.4M renovation, target $1.3M NOI stabilized
- Financing: Bridge at 70% LTV, SOFR+275
- Target hold: 5 years, 5.5% exit cap`,
    questions: [
      {
        label: "Q1: GP Fee Economics",
        prompt:
          "Calculate total management fees over the fund life: (a) Years 1-3 at 1.75% of $150M committed, (b) Years 4-8 at 1.25% of invested capital (assume 85% deployed = $127.5M invested). What is the total management fee drag to LP returns over 8 years?",
      },
      {
        label: "Q2: Waterfall — Base Case",
        prompt:
          "Assume the fund returns 1.75x net equity multiple over 8 years on $150M total equity ($147.75M LP + $2.25M GP). Total distributions: $262.5M. Work through the waterfall: (1) return of capital, (2) 8% cumulative pref on LP capital for 8 years (non-compounding), (3) 100% GP catch-up, (4) 80/20 split of remaining. Show each step and calculate LP and GP total distributions.",
      },
      {
        label: "Q3: Waterfall — Upside",
        prompt:
          "Repeat the waterfall at 2.1x net equity multiple (total distributions $315M). How does the GP economics change? What is the GP's total return multiple on their $2.25M co-invest?",
      },
      {
        label: "Q4: Waterfall — Downside",
        prompt:
          "Repeat the waterfall at 1.2x net equity multiple (total distributions $180M). Does the LP earn their 8% pref in full? Does the GP earn any carry? How does the clawback provision function in this scenario?",
      },
      {
        label: "Q5: Sample Deal Analysis",
        prompt:
          "Evaluate the sample deal. Calculate: (a) as-is NOI cap rate, (b) bridge loan amount at 70% LTV using as-is value (NOI / 5.0% cap rate), (c) IO debt service at SOFR+275 assuming SOFR=5.3%, (d) stabilized exit value at 5.5% cap on $1.3M NOI, (e) estimated IRR using simplified cash flows. Is this deal consistent with a 12-16% value-add target?",
      },
      {
        label: "Q6: Investment Memo (200 words)",
        prompt:
          "You are an LP investment analyst. Write a 200-word investment memo to your investment committee recommending APPROVE or PASS on a $10M commitment to Meridian Value-Add Fund III. Address: (1) are the GP economics (fees + carry structure) reasonable? (2) does the sample deal support the return target? (3) what is your biggest concern? (4) your recommendation with rationale.",
      },
    ],
  },
};

export default function CapstonePage() {
  const { levelId } = useParams<{ levelId: string }>();
  const level = getLevelById(levelId);
  const capstone = CAPSTONE_PROMPTS[levelId];
  const [answers, setAnswers] = useState<string[]>([]);
  const [phase, setPhase] = useState<"intro" | "quiz" | "submitting" | "results">("intro");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Record<string, { completed: boolean }>>({});

  useEffect(() => {
    async function load() {
      const [caps, comp] = await Promise.all([getCapstoneScores(), getLessonCompletion()]);
      if (caps[levelId]) setPreviousScore(caps[levelId].score);
      setCompletedLessons(comp);
    }
    load();
    if (capstone) setAnswers(new Array(capstone.questions.length).fill(""));
  }, [levelId, capstone]);

  async function submitCapstone() {
    setPhase("submitting");
    try {
      const res = await fetch("/api/grade-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: levelId,
          isCapstone: true,
          scenario: capstone.scenario,
          questions: capstone.questions.map((q) => ({
            type: "short_answer",
            question: q.prompt,
          })),
          answers,
        }),
      });
      const data = await res.json();
      setScore(data.totalScore);
      setFeedback(data.overallFeedback || "");
      await saveCapstoneScore(levelId, data.totalScore, data.overallFeedback || "");
      setPhase("results");
    } catch {
      setPhase("quiz");
      alert("Failed to submit capstone. Please try again.");
    }
  }

  if (!level || !capstone) {
    return (
      <AuthGuard>
        <AppLayout pageContext="RE Capital Academy">
          <div className="p-8 text-text-secondary">Capstone not found.</div>
        </AppLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppLayout
        pageContext={`${capstone.title}`}
        completedLessons={completedLessons}
      >
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="mb-2 text-xs text-accent-gold uppercase tracking-widest">
            Level {level.number} Capstone
          </div>
          <h1 className="font-heading text-2xl font-bold text-text-primary mb-4">
            {capstone.title}
          </h1>

          {previousScore !== null && phase !== "results" && (
            <div className="mb-4 text-xs text-text-secondary border border-border px-3 py-2">
              Previous score:{" "}
              <span className="font-mono text-accent-gold">{previousScore}/100</span>
            </div>
          )}

          {/* Intro */}
          {phase === "intro" && (
            <div>
              <div className="bg-bg-card border border-border p-5 mb-6">
                <div className="text-xs text-accent-gold uppercase tracking-wider mb-3">
                  Deal Scenario
                </div>
                <pre className="text-xs text-text-secondary whitespace-pre-wrap leading-relaxed font-body">
                  {capstone.scenario}
                </pre>
              </div>
              <div className="bg-bg-card border border-border p-4 mb-6">
                <div className="text-xs text-text-secondary">
                  {capstone.questions.length} multi-part questions — graded by AI out of 100.
                  Show your work on all calculations. The AI instructor grades on accuracy of
                  numbers AND quality of reasoning.
                </div>
              </div>
              <button
                onClick={() => setPhase("quiz")}
                className="bg-accent-gold text-bg-primary text-sm font-semibold uppercase tracking-wider px-6 py-3 hover:bg-accent-gold-light transition-colors"
              >
                Begin Capstone
              </button>
            </div>
          )}

          {/* Quiz */}
          {phase === "quiz" && (
            <div>
              <div className="bg-bg-card border border-border p-4 mb-6">
                <div className="text-xs text-accent-gold uppercase tracking-wider mb-2">
                  Reference Scenario
                </div>
                <pre className="text-xs text-text-secondary whitespace-pre-wrap leading-relaxed font-body">
                  {capstone.scenario}
                </pre>
              </div>

              <div className="space-y-5">
                {capstone.questions.map((q, i) => (
                  <div key={i} className="bg-bg-card border border-border p-5">
                    <div className="text-xs text-accent-gold font-semibold uppercase tracking-wider mb-2">
                      {q.label}
                    </div>
                    <p className="text-text-primary text-sm leading-relaxed mb-3">{q.prompt}</p>
                    <textarea
                      value={answers[i]}
                      onChange={(e) => {
                        const updated = [...answers];
                        updated[i] = e.target.value;
                        setAnswers(updated);
                      }}
                      rows={5}
                      placeholder="Show your calculations and reasoning..."
                      className="w-full bg-bg-secondary border border-border text-text-primary text-xs px-3 py-2 outline-none focus:border-accent-gold resize-y placeholder:text-text-secondary"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={submitCapstone}
                  disabled={answers.some((a) => !a.trim())}
                  className="bg-accent-gold text-bg-primary text-sm font-semibold uppercase tracking-wider px-6 py-3 hover:bg-accent-gold-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Submit for Grading
                </button>
                <span className="text-xs text-text-secondary self-center">
                  {answers.filter((a) => a.trim()).length}/{capstone.questions.length} answered
                </span>
              </div>
            </div>
          )}

          {/* Submitting */}
          {phase === "submitting" && (
            <div className="flex items-center gap-3 py-12">
              <div className="w-4 h-4 border border-accent-gold border-t-transparent animate-spin" />
              <span className="text-text-secondary text-sm">
                AI Instructor is grading your capstone...
              </span>
            </div>
          )}

          {/* Results */}
          {phase === "results" && (
            <div>
              <div
                className={`border p-6 mb-6 ${
                  score >= 70 ? "border-success-green" : "border-error-red"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold uppercase tracking-wider text-text-primary">
                    Capstone Score
                  </div>
                  <div
                    className={`font-mono text-4xl font-bold ${
                      score >= 70 ? "text-success-green" : "text-error-red"
                    }`}
                  >
                    {score}/100
                  </div>
                </div>
                {feedback && (
                  <div className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap mt-3 border-t border-border pt-3">
                    {feedback}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setAnswers(new Array(capstone.questions.length).fill(""));
                    setPhase("intro");
                  }}
                  className="text-sm font-semibold uppercase tracking-wider px-5 py-2.5 border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-bg-primary transition-colors"
                >
                  Retake Capstone
                </button>
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold uppercase tracking-wider px-5 py-2.5 border border-border text-text-secondary hover:text-text-primary transition-colors"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
