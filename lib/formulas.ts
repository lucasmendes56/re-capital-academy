export interface Formula {
  name: string;
  formula: string;
  variables: string[];
  example: string;
}

export interface FormulaCategory {
  category: string;
  items: Formula[];
}

export const FORMULAS: FormulaCategory[] = [
  {
    category: "Valuation",
    items: [
      {
        name: "Net Operating Income (NOI)",
        formula: "NOI = EGI - Operating Expenses",
        variables: ["EGI = Effective Gross Income", "Operating Expenses = all controllable property expenses (excl. debt service)"],
        example: "EGI $1,800,000 - OpEx $720,000 = NOI $1,080,000",
      },
      {
        name: "Effective Gross Income (EGI)",
        formula: "EGI = Potential Gross Rent - Vacancy & Credit Loss + Other Income",
        variables: ["Potential Gross Rent = 100% occupancy at market rents", "Vacancy & Credit Loss = typically 5-10%", "Other Income = parking, laundry, fees"],
        example: "$2,400,000 - $120,000 (5%) + $36,000 = EGI $2,316,000",
      },
      {
        name: "Capitalization Rate",
        formula: "Cap Rate = NOI / Value",
        variables: ["NOI = stabilized net operating income", "Value = purchase price or appraised value"],
        example: "NOI $1,200,000 / Value $22,857,143 = Cap Rate 5.25%",
      },
      {
        name: "Direct Capitalization Value",
        formula: "Value = NOI / Cap Rate",
        variables: ["NOI = stabilized net operating income", "Cap Rate = market cap rate for asset class/submarket"],
        example: "NOI $1,200,000 / 5.25% = Value $22,857,143",
      },
      {
        name: "Gross Rent Multiplier (GRM)",
        formula: "GRM = Price / Gross Annual Rent",
        variables: ["Price = purchase price", "Gross Annual Rent = total potential gross rent (100% occupancy)"],
        example: "Price $4,800,000 / Gross Rent $400,000 = GRM 12.0x",
      },
      {
        name: "Operating Expense Ratio (OER)",
        formula: "OER = Operating Expenses / EGI",
        variables: ["Operating Expenses = total operating costs", "EGI = effective gross income"],
        example: "OpEx $720,000 / EGI $1,800,000 = OER 40%",
      },
      {
        name: "Break-Even Occupancy",
        formula: "Break-Even Occupancy = (Operating Expenses + Debt Service) / Potential Gross Rent",
        variables: ["Operating Expenses = total operating costs", "Debt Service = annual P&I payments", "Potential Gross Rent = 100% occupancy revenue"],
        example: "($720,000 + $580,000) / $2,400,000 = 54.2%",
      },
    ],
  },
  {
    category: "Returns",
    items: [
      {
        name: "Cash-on-Cash Return",
        formula: "CoC = Annual Pre-Tax Cash Flow / Total Equity Invested",
        variables: ["Annual Pre-Tax Cash Flow = NOI - Debt Service", "Total Equity Invested = down payment + closing costs + reserves"],
        example: "$42,000 / $500,000 = 8.4% CoC",
      },
      {
        name: "Equity Multiple",
        formula: "Equity Multiple = Total Distributions / Total Equity Invested",
        variables: ["Total Distributions = all cash flows + sale proceeds received", "Total Equity Invested = initial equity contribution"],
        example: "($280,000 + $840,000) / $500,000 = 2.24x",
      },
      {
        name: "Internal Rate of Return (IRR)",
        formula: "0 = -Initial Investment + CF1/(1+IRR) + CF2/(1+IRR)² + ... + CFn/(1+IRR)ⁿ",
        variables: ["CF = cash flow in each period", "IRR = discount rate that makes NPV = 0", "n = number of periods"],
        example: "$1M equity, CFs [$65K,$68K,$71K,$74K,$77K+$1.42M exit] → IRR ≈ 18.2%",
      },
      {
        name: "Unlevered IRR",
        formula: "Unlevered IRR uses NOI cash flows and unlevered exit proceeds (no debt service deducted)",
        variables: ["NOI = net operating income each year", "Exit Value = sale price at hold period end", "No debt service deducted"],
        example: "Purchase $20M, NOI [$1.1M,$1.15M,$1.2M,$1.25M,$1.3M], Sale $24M → Unlevered IRR ≈ 10.1%",
      },
      {
        name: "Profit on Cost (Development)",
        formula: "Profit on Cost = (Stabilized Value - Total Project Cost) / Total Project Cost",
        variables: ["Stabilized Value = NOI / Exit Cap Rate", "Total Project Cost = land + hard costs + soft costs + financing costs"],
        example: "($31.4M - $25.5M) / $25.5M = 23.1% profit on cost",
      },
      {
        name: "Development Yield",
        formula: "Development Yield = Stabilized NOI / Total Project Cost",
        variables: ["Stabilized NOI = projected NOI at stabilization", "Total Project Cost = all-in development cost"],
        example: "$1.65M / $25.5M = 6.47% development yield",
      },
    ],
  },
  {
    category: "Debt Metrics",
    items: [
      {
        name: "Loan-to-Value (LTV)",
        formula: "LTV = Loan Amount / Appraised Value",
        variables: ["Loan Amount = total mortgage amount", "Appraised Value = as-is or as-stabilized value"],
        example: "$13,000,000 / $20,000,000 = 65% LTV",
      },
      {
        name: "Loan-to-Cost (LTC)",
        formula: "LTC = Loan Amount / Total Project Cost",
        variables: ["Loan Amount = construction/bridge loan amount", "Total Project Cost = land + hard + soft costs"],
        example: "$16,575,000 / $25,500,000 = 65% LTC",
      },
      {
        name: "Debt Service Coverage Ratio (DSCR)",
        formula: "DSCR = NOI / Annual Debt Service",
        variables: ["NOI = net operating income", "Annual Debt Service = annual principal + interest payments"],
        example: "NOI $1,080,000 / Debt Service $780,000 = DSCR 1.38x",
      },
      {
        name: "Debt Yield",
        formula: "Debt Yield = NOI / Loan Amount",
        variables: ["NOI = net operating income", "Loan Amount = total outstanding loan balance"],
        example: "NOI $1,080,000 / Loan $13,000,000 = Debt Yield 8.3%",
      },
      {
        name: "Annual Debt Service",
        formula: "ADS = Loan Amount × Mortgage Constant",
        variables: ["Mortgage Constant = annual payment factor based on rate and amortization term", "Interest-Only ADS = Loan × Interest Rate"],
        example: "$13M × 7.26% constant = $944,000 ADS (P&I); IO: $13M × 6.75% = $877,500",
      },
      {
        name: "RevPAR (Hospitality)",
        formula: "RevPAR = ADR × Occupancy Rate",
        variables: ["ADR = Average Daily Rate (revenue per occupied room)", "Occupancy Rate = occupied rooms / available rooms"],
        example: "$145 ADR × 72% occupancy = $104.40 RevPAR",
      },
    ],
  },
  {
    category: "Development",
    items: [
      {
        name: "Total Development Cost",
        formula: "TDC = Land Cost + Hard Costs + Soft Costs + Financing Costs",
        variables: ["Hard Costs = construction/materials/labor", "Soft Costs = architecture, legal, permits, fees", "Financing Costs = interest reserve, loan fees"],
        example: "$8.2M land + $14.5M hard + $2.8M soft = $25.5M TDC",
      },
      {
        name: "Construction Loan Interest Reserve",
        formula: "Interest Reserve = Avg Outstanding Balance × Rate × Construction Period",
        variables: ["Avg Outstanding Balance = ~50% of loan (draws over time)", "Rate = construction loan interest rate", "Construction Period = months"],
        example: "$9M avg balance × 8.5% × 18 months = $1,147,500 interest reserve",
      },
      {
        name: "Effective Rent (Office/Retail)",
        formula: "Effective Rent = (Face Rent × Lease Term - Free Rent - TI) / Lease Term",
        variables: ["Face Rent = stated annual rent per SF", "Free Rent = months of abated rent", "TI = tenant improvement allowance per SF"],
        example: "($35 × 5yr - $17.50 free rent - $80 TI amortized) / 5 = $18.50/SF effective rent",
      },
    ],
  },
  {
    category: "Waterfall Math",
    items: [
      {
        name: "Preferred Return",
        formula: "Pref Return = LP Equity × Preferred Return Rate",
        variables: ["LP Equity = limited partner capital contribution", "Preferred Return Rate = typically 6-9% (8% common)"],
        example: "$9,000,000 × 8% = $720,000 annual preferred return",
      },
      {
        name: "GP Catch-Up",
        formula: "Catch-Up = GP receives distributions until GP% of total distributions = GP promote %",
        variables: ["Catch-up distributes cash flow to GP until the GP/LP split reaches target ratio", "50% catch-up means GP gets 50 cents of every dollar until caught up"],
        example: "Total pref paid $720K. At 50% catch-up: GP gets $720K catch-up before 80/20 split begins",
      },
      {
        name: "LP Promoted Interest (Carry)",
        formula: "GP Carry = (Total Profits above Hurdle) × Carry %",
        variables: ["Total Profits above Hurdle = proceeds above LP preferred return hurdle", "Carry % = GP's promoted interest (typically 20%)"],
        example: "Profits above 8% pref: $4.2M × 20% carry = $840,000 to GP",
      },
      {
        name: "NAV Per Share (REIT)",
        formula: "NAV = Total Asset Value - Total Liabilities; NAV/Share = NAV / Shares Outstanding",
        variables: ["Total Asset Value = properties valued at market cap rates", "Total Liabilities = all debt and obligations"],
        example: "Assets $2.4B - Debt $1.1B = NAV $1.3B / 52M shares = $25.00 NAV/share",
      },
      {
        name: "FFO (REIT)",
        formula: "FFO = Net Income + Depreciation + Amortization - Gains on Sales",
        variables: ["Net Income = GAAP net income", "Depreciation = real estate depreciation added back", "Gains on Sales = one-time gains removed"],
        example: "Net Income $85M + Depreciation $140M - Gains $12M = FFO $213M",
      },
    ],
  },
];
