RE Capital Academeny Prompt
Build a full-stack real estate finance education platform called "RE Capital Academy" using Next.js 14 (App Router), Tailwind CSS, and Firebase (Firestore). Deploy target is Vercel. This is a single-user application.

AUTHENTICATION
Simple password gate on the root page. Password is Sooners56. Store auth state in localStorage. If authenticated, redirect to /dashboard. No user accounts, no OAuth — just the single password check.

TECH STACK

Next.js 14 with App Router
Tailwind CSS
Firebase Firestore (for progress tracking and quiz scores)
Anthropic Claude API (claude-sonnet-4-20250514) for the chat assistant and quiz grading
Vercel for deployment
Google Fonts: Use Playfair Display for headings and IBM Plex Sans for body text


DESIGN SYSTEM
Professional financial firm aesthetic. Think Goldman Sachs meets a Bloomberg terminal — dark navy and charcoal backgrounds, crisp white typography, gold/amber accents, clean lines, no rounded corners except subtle 2px radius, no emojis anywhere in the UI. Monospaced font for any numbers or formulas.
Color palette:

Background primary: #0A0E1A
Background secondary: #111827
Background card: #1C2333
Border: #2A3348
Text primary: #F0F4FF
Text secondary: #8B95A9
Accent gold: #C9A84C
Accent gold light: #E8C97A
Success green: #2ECC71 (for correct answers / completed)
Error red: #E74C3C (for incorrect answers)

No emojis. No purple gradients. No rounded pill buttons. Sharp, institutional, serious.

SITE STRUCTURE
/ — Password gate
/dashboard — Main hub with progress overview
/level/[levelId] — Level overview page
/lesson/[lessonId] — Individual lesson page
/quiz/[lessonId] — Quiz for a specific lesson
/capstone/[levelId] — Level-end capstone case study
/formula-sheet — Always-accessible reference page
/glossary — Always-accessible glossary page
/progress — Detailed progress and score history
Every page except / has a persistent sidebar navigation and a Claude chat panel on the right side.

NAVIGATION / LAYOUT
Persistent left sidebar (240px wide) containing:

RE Capital Academy logo/wordmark at top
Links: Dashboard, Formula Sheet, Glossary, Progress
Level navigation tree showing all 3 levels and their lessons with completion checkmarks
Sidebar collapses to icon-only on mobile

Persistent right panel (320px wide) — the Claude Chat Assistant (described below). On mobile this becomes a floating button that opens a drawer.
Main content area fills the remaining space.

COURSE CURRICULUM
LEVEL 1 — FOUNDATIONS (8 lessons)
Lesson 1-1: The Real Estate Asset Classes
Cover: Multifamily (garden, mid-rise, high-rise), Office (CBD vs suburban, Class A/B/C), Retail (strip, grocery-anchored, regional mall), Industrial (warehouse, flex, cold storage, last-mile), Hospitality (full-service, select-service, extended stay), Special Purpose (self-storage, medical office, data centers). For each class: typical tenant profiles, lease structures, demand drivers, risk profile. Include a comparison table.
Lesson 1-2: The Language of Real Estate Finance
Cover: Gross Rent vs Effective Gross Income (EGI), Vacancy & Credit Loss, Operating Expenses vs Capital Expenditures, Net Operating Income (NOI), the NOI formula with a worked multifamily example ($2.4M potential gross rent, 5% vacancy, $890K OpEx → solve for NOI). Define: GRM, OER, Break-even Occupancy. Show how the same formula applies differently across asset classes.
Lesson 1-3: Capitalization Rates & Direct Capitalization
Cover: Cap rate definition (NOI / Value), what drives cap rate compression and expansion, historical context (2010 vs 2020 vs 2024), cap rate by asset class table, direct capitalization valuation method. Worked examples: (1) Industrial warehouse NOI $1.2M at 5.25% cap → value; (2) Retail strip center, solve for implied cap rate from purchase price; (3) Why a multifamily property and an office building with identical NOI trade at different cap rates. Include a sensitivity table: NOI vs cap rate → value.
Lesson 1-4: Debt Fundamentals
Cover: LTV (Loan-to-Value), LTC (Loan-to-Cost), DSCR (Debt Service Coverage Ratio), Debt Yield, Interest-only periods, Amortization schedules. Worked example: $10M office acquisition, 65% LTV, 6.75% rate, 30-yr am, 2 years IO → build the full debt schedule for years 1-5. Explain why lenders use DSCR AND debt yield (not just LTV). Show how the same loan metrics look different for a multifamily vs hospitality deal.
Lesson 1-5: Equity Returns — Cash-on-Cash and Equity Multiple
Cover: Cash-on-Cash return formula, Equity Multiple, how they differ and when each matters. Worked example: $500K equity into a retail acquisition, Year 1 cash flow $42K → CoC; over 5 years total distributions $280K + $340K profit on sale → equity multiple. Contrast with a multifamily example. Limitations of each metric.
Lesson 1-6: Introduction to IRR
Cover: Time value of money, IRR definition, how to interpret it (hurdle rates, typical targets by risk profile), levered vs unlevered IRR conceptually. Worked example: Industrial deal, $1M equity invested, 5-year hold, annual cash flows [$65K, $68K, $71K, $74K, $77K], exit proceeds $1.42M → solve IRR. Explain the math without requiring the student to use Excel. Compare to equity multiple. Common misconception: "higher IRR always better."
Lesson 1-7: Basic Valuation Methods
Cover: The three approaches — Income (direct cap + DCF), Sales Comparison, Cost Approach. When each is used and by whom (appraiser vs investor vs lender). Worked example of sales comp adjustment grid for a multifamily property. Cost approach for a special-purpose asset. Why investors almost always lead with the income approach.
Lesson 1-8: Reading a Rent Roll
Cover: What a rent roll contains, how to analyze it, red flags (near-term lease expirations, below-market rents, single-tenant concentration). Worked example: Office building rent roll with 6 tenants, identify the risks. Introduce WALT (Weighted Average Lease Term) and WALE. Multifamily rent roll vs commercial rent roll — key differences.

LEVEL 2 — DEAL ANALYSIS (8 lessons)
Lesson 2-1: Building a Multifamily Acquisition Model
Walk through a full acquisition underwriting: $18.5M garden-style apartment complex, 120 units, current NOI $925K, Year 1 projected NOI $980K after light value-add. 60% LTV, 6.5% rate, 3 years IO then 30-yr am. 5-year hold, exit at 5.5% cap. Build line by line: income → NOI → debt service → levered cash flows → IRR and equity multiple.
Lesson 2-2: Value-Add Strategy & Underwriting
Cover: What value-add means across different asset classes, renovation cost underwriting, stabilization timeline risk, rent premium assumptions, exit cap rate spread risk. Case study: 1980s multifamily complex, $2.2M renovation budget over 24 months, unit-by-unit upgrade program → model the J-curve cash flow effect. How to stress-test renovation cost overruns and lease-up delays.
Lesson 2-3: Office & Retail Leasing Economics
Cover: Gross lease vs Net lease vs Modified Gross vs Triple-Net (NNN), Tenant Improvement Allowances (TI), Free Rent periods, Lease commissions, Effective rent calculation. Worked example: Office tenant, 5,000 SF, $35/SF gross, 6 months free rent, $80/SF TI, 5% commission → calculate effective rent and landlord's net economics. Contrast with NNN retail: what the landlord actually receives vs face rent.
Lesson 2-4: Industrial & Self-Storage Underwriting
Cover: Industrial lease types (NNN standard), rent escalations (fixed bumps vs CPI), dock-high vs grade-level, clear height premium, cold storage differential. Self-storage: street rate vs achieved rate, occupancy dynamics, expense ratio advantages. Full underwriting example: 200,000 SF distribution center, $8.50/SF NNN, 3% annual bumps, 10-year lease, 5.0% cap exit → IRR analysis.
Lesson 2-5: Hotel & Hospitality Finance
Cover: RevPAR, ADR, Occupancy Rate, NOI margin differences vs other asset classes, why hotels trade on EBITDA multiples not just cap rates. Flag vs independent, franchise fees, management fees, FF&E reserves. Worked example: 150-key select-service hotel, $145 ADR, 72% occupancy → RevPAR → rooms revenue → total revenue → NOI after management fees and FF&E. Why lenders are more conservative on hospitality debt.
Lesson 2-6: Development Proforma Basics
Cover: Hard costs vs soft costs vs land, construction loan mechanics (draws, interest reserve), development spread (stabilized value minus total cost), development yield, profit on cost. Case study: Ground-up 80-unit multifamily, $8.2M land, $14.5M hard costs, $2.8M soft costs → total cost; stabilized NOI $1.65M at 5.25% cap → value; calculate development spread and profit on cost. Construction loan sizing.
Lesson 2-7: Debt Structures — Bridge, Construction, Permanent
Cover: Bridge loans (floating rate, short-term, interest-only, SOFR + spread), Construction loans (draws, completion guarantees, recourse), Permanent/Agency debt (Fannie/Freddie for multifamily, CMBS for commercial, life company). Mezz debt and preferred equity. When to use each. Worked example: Value-add industrial deal, bridge loan at SOFR+275, 2+1 year term, exit to CMBS permanent financing → model the full capital stack and total financing cost.
Lesson 2-8: The Full Capital Stack
Cover: Common equity, preferred equity, mezzanine debt, B-note, senior debt. Risk/return at each layer. Waterfall mechanics preview. LTV at each layer. Case study: $50M office acquisition, build the capital stack: $30M senior at 65% LTV, $5M mezz at 75% LTV, $5M preferred equity at 85% of cost, $10M common equity → returns to each tranche at different exit scenarios (base case, downside, upside). Who gets hurt first.

LEVEL 3 — ADVANCED STRUCTURING (8 lessons)
Lesson 3-1: IRR Deep Dive & Modified IRR
Cover: Why IRR has reinvestment rate assumptions baked in, MIRR and when it matters, multiple IRR problem (sign changes), GP vs LP IRR divergence in waterfalls. Detailed worked example showing how a GP can have a higher IRR than the LP on the same deal through promote mechanics.
Lesson 3-2: Equity Waterfall Structures
Cover: Pari passu return of capital, preferred return (8% typical), catch-up provisions, carried interest / promote (20% typical), tiered IRR hurdles. Full waterfall model: $10M equity ($1M GP / $9M LP), 8% pref, 50% GP catch-up, then 80/20 split above 12% IRR, 70/30 above 18% IRR. Walk through the math at 3 exit scenarios. Explain why this structure aligns incentives.
Lesson 3-3: CMBS & Securitization
Cover: How CMBS works, the securitization chain (originator → trust → tranches), IO vs PAC tranches, DSCR and LTV tests, defeasance and yield maintenance prepayment penalties, special servicer role. Why CMBS pricing differs from balance sheet lending. Case study: $25M CMBS loan on a retail center, calculate yield maintenance penalty at Year 3 payoff.
Lesson 3-4: Ground Leases & Sale-Leasebacks
Cover: Ground lease structure and valuation, subordinated vs unsubordinated, impact on LTV and lender appetite, why institutional investors use them. Sale-leaseback mechanics: seller/tenant economics, cap rate arbitrage. Case study: Industrial owner-operator, $40M facility, sale-leaseback at 5.75% cap, 20-year NNN lease → seller proceeds, retained occupancy, tax implications conceptually.
Lesson 3-5: Distressed Real Estate & Restructuring
Cover: Loan modifications, note purchases, deed-in-lieu, foreclosure timeline, A/B note splits, loan-to-own strategy. Value in distress: how to underwrite a non-performing loan. Case study: Office building, $35M loan on a building worth $28M, purchase the note at $24M → model the restructuring scenarios (sell the note, foreclose and reposition, negotiate a short sale).
Lesson 3-6: REIT Structure & Analysis
Cover: REIT qualification requirements, FFO vs AFFO vs Net Income (and why GAAP earnings are misleading for REITs), NAV per share calculation, implied cap rate, dividend yield. Sector-by-sector REIT overview. Mini case study: Analyze a simplified REIT income statement, calculate FFO, AFFO, NAV, and determine if the stock trades at a premium or discount to NAV.
Lesson 3-7: Fund Structures & LP/GP Economics
Cover: Closed-end vs open-end funds, blind pool vs identified assets, management fee (1-2% of committed/invested capital), carried interest, preferred return, GP co-investment requirements, clawback provisions. Case study: $200M closed-end value-add fund, 1.5% management fee, 8% pref, 20% carry → calculate GP economics over fund life at two return scenarios.
Lesson 3-8: Portfolio Strategy & Market Cycles
Cover: Core / Core-Plus / Value-Add / Opportunistic risk spectrum, how allocation shifts through the cycle, interest rate sensitivity by asset class, cap rate expansion risk in rising rate environments, inflation hedges within real estate. Final synthesis: given a portfolio of assets and a market environment, how would you adjust strategy? This lesson is discussion-based with no single correct answer — use the chat assistant.

QUIZ SYSTEM
Each lesson has an associated quiz at /quiz/[lessonId] with the following structure:

5 questions per quiz, mixed format: multiple choice (2 questions), calculation problem (2 questions), short answer / explain-your-thinking (1 question)
Questions are generated by Claude using the lesson content as context. Inject the full lesson topic and key concepts into the system prompt when generating questions.
Difficulty distribution: 1 easy, 2 medium, 2 hard per quiz
Answers are graded by Claude: multiple choice auto-graded, calculation problems graded with partial credit logic, short answers graded on conceptual accuracy
Score displayed as X/100 with detailed feedback on each question
Scores saved to Firestore under progress/quiz_scores/[lessonId]
A quiz can be retaken. Show best score and attempt count.
Show a "Review Answers" screen after submission with Claude's explanation of the correct answer for each question


CAPSTONE CASE STUDIES
At /capstone/[levelId]. Each capstone is a multi-part deal analysis case study:
Level 1 Capstone: Given a simplified multifamily deal (rent roll, income statement, asking price), answer 8 guided questions covering: NOI calculation, cap rate implied, basic debt sizing, CoC return, equity multiple. Graded by Claude out of 100.
Level 2 Capstone: Full acquisition underwriting. Student is given a deal memo for a 96-unit value-add apartment complex and must build the analysis: current NOI, projected NOI post-renovation, debt structure, 5-year cash flows, levered IRR, equity multiple, and a go/no-go recommendation with written justification. Claude grades the numbers and the reasoning.
Level 3 Capstone: A GP is raising a $150M value-add fund. You are the LP. You receive a fund PPM summary with fee structure, waterfall, target returns, and a sample deal. Analyze: (1) are the GP economics fair? (2) model the waterfall at base/upside/downside, (3) write a 200-word investment memo recommending approve or pass. Claude grades all three parts.

CLAUDE CHAT ASSISTANT
Present on every page as a right panel (desktop) or floating drawer (mobile).
System prompt for the assistant:
You are a senior real estate finance instructor and advisor embedded in RE Capital Academy, a professional real estate finance course. The student is currently on [CURRENT_PAGE_CONTEXT] — inject the current lesson title, level, and topic dynamically.

Your role:
1. Answer questions about the current lesson topic with precision and real-world examples
2. Answer general real estate finance questions the student raises
3. Proactively prompt the student when appropriate — if they've been reading for a while, suggest "Ready to test yourself on cap rates? Try the quiz for this lesson."
4. When explaining concepts, always use specific numbers. Never say "some amount" — make up realistic deal numbers.
5. Reference specific asset classes with appropriate examples: use multifamily for yield/cash flow questions, industrial for NNN lease questions, office for lease structure complexity, hospitality for operational metrics, retail for credit tenant vs mom-and-pop distinctions.
6. Be concise but complete. No filler. Every sentence should teach something.
7. If the student gets something wrong in conversation, correct them directly but constructively.
8. When relevant, reference other lessons in the course: "This connects to what you'll see in Lesson 2-7 on debt structures."
9. Tone: professional, direct, expert. Like a senior analyst teaching an associate.
10. Never use emojis.
Chat history persists within a session. Each page load injects the current lesson context into the system prompt.

PROGRESS TRACKING
Firestore document structure:
progress/ (collection)
  lesson_completion/ (document)
    [lessonId]: { completed: bool, completedAt: timestamp, timeSpent: number }
  quiz_scores/ (document)
    [lessonId]: { bestScore: number, attempts: number, lastAttempt: timestamp }
  capstone_scores/ (document)
    [levelId]: { score: number, submittedAt: timestamp, feedback: string }
Dashboard shows:

Overall completion percentage
Lessons completed / 24
Average quiz score
Current streak (days with activity)
Level-by-level progress bars
Recent activity feed

A lesson can be manually marked complete (checkbox) or auto-marked when the quiz is passed with score >= 70.

FORMULA SHEET PAGE (/formula-sheet)
Organized by category. Each formula displayed in a clean card with: formula name, the formula itself in monospace, variable definitions, and a one-line example. Categories: Valuation, Returns, Debt Metrics, Development, Waterfall Math. Approximately 30 formulas total. No Claude interaction needed on this page — static content.

GLOSSARY PAGE (/glossary)
Alphabetical list of ~80 real estate finance terms. Each term has a 2-3 sentence definition and an example in context. Terms include all jargon used throughout the course. Searchable via a text input. Static content.

ENVIRONMENT VARIABLES NEEDED
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
ANTHROPIC_API_KEY=

DEPLOYMENT NOTES

All Claude API calls must go through Next.js API routes (/api/chat, /api/grade-quiz, /api/generate-quiz) — never expose the Anthropic API key client-side
Firebase config can be public (NEXT_PUBLIC_ prefix)
Add vercel.json with appropriate function timeout for Claude API routes (60 seconds)
Include a README.md with: local setup instructions, environment variable guide, Firebase setup steps (create project, enable Firestore, set rules to allow read/write), Vercel deployment steps