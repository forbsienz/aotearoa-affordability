# Operator checklist

## Monthly / quarterly refresh

1. Download latest MBIE bond TA CSV → `data/raw/mbie/`
2. Refresh Stats NZ CPI / RPI / FPI / SPI extracts → `data/raw/stats_nz/`
3. Refresh LEED TA earnings when the quarter lands
4. Download HUD MCERT HPI / sales extract → `data/raw/hud/`
5. Update RBNZ floating rate CSV → `data/raw/rbnz/`
6. `make pipeline` (or `make fixtures` for demo data only)
7. Spot-check `/area/wellington-city` hero copy and geo badges
8. Deploy web (`docs/DEPLOYMENT.md`)

## Pilot TAs (v0.1)

Configured in `pipeline/config/sources.yaml`:

- Wellington City
- Palmerston North City
- Christchurch City
- Auckland

Expand `pilot_tas` and source CSVs to go nationwide.

## Secrets

Never commit `.env`. Keys needed only for optional live API pulls:

- `STATS_NZ_ADE_SUBSCRIPTION_KEY`
- `MBIE_MARKET_RENT_API_KEY`
- `ADDRESSFINDER_KEY` / `ADDRESSFINDER_SECRET` (address search)
- `NEXT_PUBLIC_SITE_URL` (production canonical URL)
