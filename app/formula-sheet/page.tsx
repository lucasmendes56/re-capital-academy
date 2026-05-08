import AppLayout from "@/components/AppLayout";
import AuthGuard from "@/components/AuthGuard";
import { FORMULAS } from "@/lib/formulas";

export default function FormulaSheet() {
  return (
    <AuthGuard>
      <AppLayout pageContext="the Formula Sheet — reference for all key real estate finance formulas">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-2 text-xs text-accent-gold uppercase tracking-widest">Reference</div>
          <h1 className="font-heading text-3xl font-bold text-text-primary mb-1">Formula Sheet</h1>
          <p className="text-text-secondary text-sm mb-8">
            Quick reference for all key real estate finance formulas. Always accessible.
          </p>

          <div className="space-y-10">
            {FORMULAS.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-heading text-lg font-semibold text-accent-gold uppercase tracking-wider">
                    {cat.category}
                  </h2>
                  <div className="flex-1 border-t border-border" />
                </div>
                <div className="grid gap-3">
                  {cat.items.map((f) => (
                    <div key={f.name} className="bg-bg-card border border-border p-5">
                      <div className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
                        {f.name}
                      </div>
                      <div className="font-mono text-sm text-accent-gold-light bg-bg-secondary border border-border px-4 py-2 mb-3">
                        {f.formula}
                      </div>
                      <div className="mb-3">
                        {f.variables.map((v) => (
                          <div key={v} className="text-xs text-text-secondary leading-relaxed">
                            — {v}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-text-secondary border-t border-border pt-3 mt-3">
                        <span className="text-text-primary">Example: </span>
                        {f.example}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
