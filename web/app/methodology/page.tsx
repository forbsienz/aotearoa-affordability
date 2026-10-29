import { SITE_NAME } from "@/lib/site";

export const metadata = {
  title: "Methodology",
  description: "How Aotearoa Affordability builds place briefs from open data.",
};

export default function MethodologyPage() {
  return (
    <article className="prose-like card max-w-3xl space-y-4 p-5 sm:p-8">
      <h1 className="text-3xl">Methodology</h1>
      <p className="text-[var(--text-muted)]">
        {SITE_NAME} is a batch analytics product: open datasets are downloaded, cleaned, joined to
        Stats NZ geography, and exported as static JSON briefs for the web app.
      </p>

      <h2 className="text-xl">Primary sources</h2>
      <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--text-muted)]">
        <li>
          <strong>MBIE Tenancy Services</strong> — rental bond geometric-mean rents by Territorial
          Authority (new tenancies).
        </li>
        <li>
          <strong>Stats NZ LEED</strong> — median earnings for continuing jobs by TA (workplace
          location).
        </li>
        <li>
          <strong>Stats NZ CPI / RPI / FPI / SPI</strong> — national inflation and five broad-region
          rent and food indexes; petrol and electricity from Selected Price Indexes.
        </li>
        <li>
          <strong>HUD MCERT</strong> — house price index and median sales by TA.
        </li>
        <li>
          <strong>RBNZ</strong> — floating mortgage rate used only for illustrative weekly interest
          cost.
        </li>
        <li>
          <strong>Stats NZ 2023 Census</strong> — resident income, rent paid, and main means of
          travel to work.
        </li>
      </ul>

      <h2 className="text-xl">Geography rules</h2>
      <p className="text-sm text-[var(--text-muted)]">
        Live rent and wage trends are shown at Territorial Authority level. Inflation is national
        or one of five CPI regions. Suburb/SA2 pages in later releases use Census baselines and,
        where bond counts allow, Market Rent API cuts — never invented suburb CPI.
      </p>

      <h2 className="text-xl">Affordability ratios</h2>
      <p className="text-sm text-[var(--text-muted)]">
        Weekly earnings are approximated as quarterly LEED median ÷ 13. Rent share and illustrative
        mortgage share divide local housing costs by that weekly figure. These are explanatory
        ratios, not household budgets.
      </p>

      <h2 className="text-xl">Refresh cadence</h2>
      <p className="text-sm text-[var(--text-muted)]">
        Bond rents and SPI components refresh monthly when files are available. LEED and CPI refresh
        quarterly. Census fields are static until the next census.
      </p>
    </article>
  );
}
