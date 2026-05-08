export interface Lesson {
  id: string;
  levelId: string;
  number: string;
  title: string;
  description: string;
  topics: string[];
}

export interface Level {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  lessons: Lesson[];
}

export const CURRICULUM: Level[] = [
  {
    id: "level-1",
    number: 1,
    title: "FOUNDATIONS",
    subtitle: "Core concepts, terminology, and valuation fundamentals",
    lessons: [
      {
        id: "1-1",
        levelId: "level-1",
        number: "1-1",
        title: "The Real Estate Asset Classes",
        description: "Multifamily, Office, Retail, Industrial, Hospitality, and Special Purpose — tenant profiles, lease structures, demand drivers, and risk profiles.",
        topics: ["Multifamily", "Office", "Retail", "Industrial", "Hospitality", "Special Purpose", "Asset class comparison"],
      },
      {
        id: "1-2",
        levelId: "level-1",
        number: "1-2",
        title: "The Language of Real Estate Finance",
        description: "GRI, EGI, vacancy, OpEx, CapEx, NOI — the foundational vocabulary with worked examples.",
        topics: ["Gross Rent", "EGI", "Vacancy & Credit Loss", "NOI formula", "GRM", "OER", "Break-even Occupancy"],
      },
      {
        id: "1-3",
        levelId: "level-1",
        number: "1-3",
        title: "Capitalization Rates & Direct Capitalization",
        description: "Cap rate mechanics, compression vs expansion, direct capitalization valuation, and sensitivity tables.",
        topics: ["Cap rate definition", "Cap rate drivers", "Direct capitalization", "Sensitivity analysis", "Asset class cap rate differences"],
      },
      {
        id: "1-4",
        levelId: "level-1",
        number: "1-4",
        title: "Debt Fundamentals",
        description: "LTV, LTC, DSCR, debt yield, amortization schedules — how lenders underwrite commercial real estate.",
        topics: ["LTV", "LTC", "DSCR", "Debt Yield", "Interest-only periods", "Amortization schedules"],
      },
      {
        id: "1-5",
        levelId: "level-1",
        number: "1-5",
        title: "Equity Returns — Cash-on-Cash and Equity Multiple",
        description: "Cash-on-Cash return and equity multiple — how investors measure annual yield vs total return.",
        topics: ["Cash-on-Cash return", "Equity Multiple", "Levered returns", "Limitations of each metric"],
      },
      {
        id: "1-6",
        levelId: "level-1",
        number: "1-6",
        title: "Introduction to IRR",
        description: "Time value of money, IRR definition, hurdle rates, levered vs unlevered — with a full worked example.",
        topics: ["Time value of money", "IRR definition", "Hurdle rates", "Levered vs unlevered IRR", "IRR vs equity multiple"],
      },
      {
        id: "1-7",
        levelId: "level-1",
        number: "1-7",
        title: "Basic Valuation Methods",
        description: "Income approach, sales comparison, and cost approach — when each is used and by whom.",
        topics: ["Income approach", "Sales comparison", "Cost approach", "DCF vs direct cap", "Appraiser vs investor perspective"],
      },
      {
        id: "1-8",
        levelId: "level-1",
        number: "1-8",
        title: "Reading a Rent Roll",
        description: "How to analyze a rent roll, identify red flags, calculate WALT and WALE.",
        topics: ["Rent roll structure", "Red flags", "WALT", "WALE", "Multifamily vs commercial rent roll"],
      },
    ],
  },
  {
    id: "level-2",
    number: 2,
    title: "DEAL ANALYSIS",
    subtitle: "Full acquisition underwriting across asset classes",
    lessons: [
      {
        id: "2-1",
        levelId: "level-2",
        number: "2-1",
        title: "Building a Multifamily Acquisition Model",
        description: "Full acquisition underwriting for an $18.5M garden-style apartment complex — line by line.",
        topics: ["Income underwriting", "NOI build", "Debt service", "Levered cash flows", "IRR & equity multiple"],
      },
      {
        id: "2-2",
        levelId: "level-2",
        number: "2-2",
        title: "Value-Add Strategy & Underwriting",
        description: "Renovation cost underwriting, stabilization timeline risk, J-curve cash flows, stress testing.",
        topics: ["Value-add definition", "Renovation underwriting", "J-curve effect", "Rent premium assumptions", "Exit cap spread risk"],
      },
      {
        id: "2-3",
        levelId: "level-2",
        number: "2-3",
        title: "Office & Retail Leasing Economics",
        description: "Lease types, TI allowances, free rent, commissions, effective rent calculation.",
        topics: ["Gross lease", "Net lease", "NNN", "TI allowances", "Free rent", "Effective rent"],
      },
      {
        id: "2-4",
        levelId: "level-2",
        number: "2-4",
        title: "Industrial & Self-Storage Underwriting",
        description: "Industrial NNN leases, rent escalations, self-storage dynamics — full underwriting example.",
        topics: ["Industrial lease types", "Rent escalations", "Clear height premium", "Self-storage dynamics", "200K SF case study"],
      },
      {
        id: "2-5",
        levelId: "level-2",
        number: "2-5",
        title: "Hotel & Hospitality Finance",
        description: "RevPAR, ADR, occupancy, NOI margins, franchise fees — why hotels are different.",
        topics: ["RevPAR", "ADR", "Occupancy Rate", "EBITDA multiples", "Franchise fees", "FF&E reserves"],
      },
      {
        id: "2-6",
        levelId: "level-2",
        number: "2-6",
        title: "Development Proforma Basics",
        description: "Hard costs, soft costs, construction loan mechanics, development spread, profit on cost.",
        topics: ["Hard costs", "Soft costs", "Construction loan", "Development yield", "Profit on cost", "Development spread"],
      },
      {
        id: "2-7",
        levelId: "level-2",
        number: "2-7",
        title: "Debt Structures — Bridge, Construction, Permanent",
        description: "Bridge loans, construction loans, agency debt, CMBS, mezz — when to use each.",
        topics: ["Bridge loans", "Construction loans", "Permanent debt", "Agency debt", "CMBS", "Mezz & preferred equity"],
      },
      {
        id: "2-8",
        levelId: "level-2",
        number: "2-8",
        title: "The Full Capital Stack",
        description: "Common equity, preferred equity, mezz, B-note, senior debt — risk/return at each layer.",
        topics: ["Capital stack layers", "Risk/return by tranche", "LTV by layer", "Waterfall preview", "Downside scenarios"],
      },
    ],
  },
  {
    id: "level-3",
    number: 3,
    title: "ADVANCED STRUCTURING",
    subtitle: "Complex deal structures, fund mechanics, and market strategy",
    lessons: [
      {
        id: "3-1",
        levelId: "level-3",
        number: "3-1",
        title: "IRR Deep Dive & Modified IRR",
        description: "Reinvestment rate assumptions, MIRR, multiple IRR problem, GP vs LP IRR divergence.",
        topics: ["IRR reinvestment assumption", "MIRR", "Multiple IRR", "GP vs LP IRR", "Promote mechanics"],
      },
      {
        id: "3-2",
        levelId: "level-3",
        number: "3-2",
        title: "Equity Waterfall Structures",
        description: "Preferred return, catch-up provisions, carried interest, tiered IRR hurdles — full waterfall model.",
        topics: ["Preferred return", "Catch-up", "Carried interest", "IRR hurdles", "GP/LP split"],
      },
      {
        id: "3-3",
        levelId: "level-3",
        number: "3-3",
        title: "CMBS & Securitization",
        description: "How CMBS works, the securitization chain, IO tranches, defeasance, yield maintenance.",
        topics: ["CMBS structure", "Securitization chain", "DSCR/LTV tests", "Defeasance", "Yield maintenance"],
      },
      {
        id: "3-4",
        levelId: "level-3",
        number: "3-4",
        title: "Ground Leases & Sale-Leasebacks",
        description: "Ground lease valuation, subordinated vs unsubordinated, sale-leaseback mechanics.",
        topics: ["Ground lease structure", "Subordinated vs unsubordinated", "Sale-leaseback", "Cap rate arbitrage", "Tax implications"],
      },
      {
        id: "3-5",
        levelId: "level-3",
        number: "3-5",
        title: "Distressed Real Estate & Restructuring",
        description: "Loan modifications, note purchases, foreclosure, loan-to-own — underwriting NPLs.",
        topics: ["Loan modifications", "Note purchases", "Foreclosure timeline", "A/B note splits", "Loan-to-own"],
      },
      {
        id: "3-6",
        levelId: "level-3",
        number: "3-6",
        title: "REIT Structure & Analysis",
        description: "REIT qualification, FFO vs AFFO, NAV per share, implied cap rate, dividend yield.",
        topics: ["REIT requirements", "FFO", "AFFO", "NAV calculation", "Premium/discount to NAV"],
      },
      {
        id: "3-7",
        levelId: "level-3",
        number: "3-7",
        title: "Fund Structures & LP/GP Economics",
        description: "Closed-end vs open-end funds, management fees, carried interest, clawback provisions.",
        topics: ["Closed-end vs open-end", "Management fee", "Carried interest", "Clawback", "GP co-investment"],
      },
      {
        id: "3-8",
        levelId: "level-3",
        number: "3-8",
        title: "Portfolio Strategy & Market Cycles",
        description: "Core/Value-Add/Opportunistic spectrum, cycle positioning, interest rate sensitivity.",
        topics: ["Risk spectrum", "Market cycles", "Interest rate sensitivity", "Cap rate expansion risk", "Inflation hedges"],
      },
    ],
  },
];

export function getLessonById(id: string): Lesson | undefined {
  for (const level of CURRICULUM) {
    const lesson = level.lessons.find((l) => l.id === id);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getLevelById(id: string): Level | undefined {
  return CURRICULUM.find((l) => l.id === id);
}

export function getAllLessons(): Lesson[] {
  return CURRICULUM.flatMap((l) => l.lessons);
}
