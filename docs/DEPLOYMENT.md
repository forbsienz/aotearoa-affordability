# Deployment

## Vercel (recommended)

1. Import `forbsienz/aotearoa-affordability` in Vercel
2. Set **Root Directory** to `web`
3. Framework: Next.js
4. Environment variables:
   - `NEXT_PUBLIC_SITE_URL` = your production URL
   - Optional Addressfinder / analytics keys later
5. Build command: `npm run build` (default)
6. Ensure `web/public/data/**` is present in the repo (committed fixture/pilot JSON) or generate in CI before build:

```bash
make install-pipeline && make fixtures
```

## Local

```bash
make install-pipeline
make install-web
make fixtures
make dev
```

Open http://localhost:3000

## CI suggestion

On each release branch: run `make test-pipeline`, then `cd web && npm ci && npm run build`.
