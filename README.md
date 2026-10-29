# Aotearoa Affordability

**How do wages and living costs stack up where you live?**

Aotearoa Affordability turns Stats NZ, MBIE, HUD, and RBNZ open data into clear, place-level briefs: rent vs workplace earnings, inflation context, house prices, illustrative mortgage costs, and commute patterns.

> **Not affiliated with Stats NZ, MBIE, HUD, RBNZ, or any government agency.**

---

## Purpose

Official economic releases are thorough but dense. Most people want a simpler local answer: *what do new rents cost here, how are wages moving, and how does that compare to inflation and nearby places?*

This product:

1. **Extracts** open MBIE, Stats NZ, HUD, and RBNZ datasets  
2. **Transforms** them into Territorial Authority (and optional SA2) metrics with honest geography labels  
3. **Loads** static JSON for a fast mobile-first web front end  
4. **Presents** calm, transparent explanations — never inventing suburb-level CPI  

---

## Technology stack

| Layer | Choice |
| --- | --- |
| ETL | Python 3.11+, pandas, pyarrow, PyYAML, pytest |
| Serving | Static JSON under `web/public/data/` |
| Web | Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4 |

---

## Quick start

```bash
make install-pipeline
make install-web
make fixtures          # sample CSVs + build briefs
make dev               # http://localhost:3000
```

Live open-data refresh (when raw downloads / API keys are configured):

```bash
cp .env.example .env   # fill keys as needed
make pipeline
```

---

## Geography honesty

| Grain | Typical metrics |
| --- | --- |
| **TA (primary)** | New-bond rent, LEED workplace earnings, MCERT house prices |
| **SA2 / suburb** | Census 2023 income & rent paid; commute mode (static) |
| **5 CPI regions** | Rent / food inflation |
| **National** | CPI, HLPI, QES/LCI, RBNZ mortgage rate (illustrative) |

Every number in the UI carries a **geography badge** and source period.

---

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [ETL pipeline](docs/ETL_PIPELINE.md)
- [Operator checklist](docs/USER_ACTIONS.md)
- [Deployment](docs/DEPLOYMENT.md)

---

## Licence

MIT — see [LICENSE](LICENSE). Source data remains under each publisher’s terms.
