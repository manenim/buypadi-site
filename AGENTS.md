<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# BuyPadi Landing/Admin Frontend

This app is the BuyPadi public site, inspection request form, tracking experience, public invoice flow, and admin console.

## Commands

Run from `landing-page/`:

```bash
npm run dev
npm run lint
npm run build
```

There is no test script at the moment. Use lint and build as the baseline verification for frontend work.

## App Shape

- Framework: Next.js `16.2.2`, React `19.2.4`, TypeScript, Tailwind CSS v4.
- App Router files live in `app/`.
- Public routes: `/`, `/request`, `/track`, `/invoice/[token]`, `/invoice/[token]/success`.
- Admin routes: `/admin`, `/admin/requests`, `/admin/requests/[id]`, `/admin/invoices/[id]`.
- Shared API client: `app/lib/api.ts`.
- Shared statuses/types: `app/lib/types.ts`.
- Path alias: `@/*` maps to the app root, so imports like `@/app/lib/api` are expected.

## API Contract

- `NEXT_PUBLIC_API_URL` should include the `/api` backend prefix. The local fallback is `http://localhost:3001/api`.
- The backend wraps success responses as `{ statusCode, success, message, data }`. The frontend `request<T>()` helper unwraps and returns `json.data`.
- Keep frontend local types in sync with backend DTOs/entities when API fields change.
- Do not reintroduce mock-store/mock-data patterns; current flows use real backend calls.

## UI Conventions

- Preserve the current BuyPadi visual language: dark green `primary`, lime accents, light gray surfaces, Plus Jakarta Sans for display text, Inter for body text.
- Theme tokens are defined in `app/globals.css`; prefer those Tailwind token names over raw colors.
- Reuse patterns from `app/components` and `app/components/admin` before creating new primitives.
- Format naira amounts as `₦${Number(value).toLocaleString('en-NG')}`.
- Admin pages currently have no auth guard in this codebase, so do not assume authenticated user context exists.
