const TERMS = [
  {
    term: "Territorial Authority (TA)",
    def: "City or district council area — the primary grain for live rent and LEED earnings in this app.",
  },
  {
    term: "SA2",
    def: "Statistical Area 2 — neighbourhood-scale geography used for Census income and commute modes.",
  },
  {
    term: "Geometric mean rent",
    def: "MBIE-preferred summary of new-bond rents; less sticky than a rounded median.",
  },
  {
    term: "LEED",
    def: "Linked Employer–Employee Data — payroll-based jobs and earnings statistics from Stats NZ.",
  },
  {
    term: "CPI region",
    def: "One of five broad regions Stats NZ uses for selected price indexes (not your suburb).",
  },
  {
    term: "RPI (flow)",
    def: "Rental Price Index for new tenancy rents — a price change index, not a dollar rent level.",
  },
  {
    term: "Illustrative mortgage",
    def: "Interest-only weekly cost from local median sale × 80% LVR × national floating rate. Not a loan quote.",
  },
];

export const metadata = {
  title: "Glossary",
};

export default function GlossaryPage() {
  return (
    <div className="card max-w-3xl space-y-4 p-5 sm:p-8">
      <h1 className="text-3xl">Glossary</h1>
      <dl className="space-y-4">
        {TERMS.map((t) => (
          <div key={t.term}>
            <dt className="font-semibold">{t.term}</dt>
            <dd className="mt-1 text-sm text-[var(--text-muted)]">{t.def}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
