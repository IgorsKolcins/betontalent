# Gaming Dashboard

A SvelteKit dashboard built for the senior frontend take-home assessment.

## Requirements

- Node.js 22.13+
- npm 10+

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`.

## Tests

Run the unit and end-to-end test suites:

```bash
npm test
```

## Demo login

Use `admin@demo.test`, `editor@demo.test`, or `viewer@demo.test` with password `demo1234`.

## What I implemented

- Localized public routes for the homepage, blog, article, search, and custom error page, with URL-synced search, filtering, sorting, and pagination.
- Signed cookie authentication, shared client/server Zod validation, protected dashboard routes, and role-based campaign editing.
- A streamed dashboard table with server-side queries, loading/empty/error states, and optimistic status updates with rollback.
- EN/DE routing, token-based light/dark themes, reusable UI primitives, validated mock-data contracts, and locale-aware formatting.
- Deliberate SSG, SSR, streamed SSR, Edge, and Node runtime boundaries.
- Vitest component/business-logic coverage plus Playwright anonymous and authenticated flows, Axe checks, and a visual snapshot.

## What I did not implement

- The homepage feature, pricing, and social-proof sections.
- Lighthouse and bundle-size budgets, CI, pre-commit hooks, RUM, and client error reporting.
- Complete SEO coverage: social metadata, homepage JSON-LD, article sitemap entries, and generated OG images.
- A fully hand-built complex accessible composite; the dialog/drawer uses Bits UI primitives.
- The optional offline shell, partial prerendering, and SSR feature flag, or a live deployment.

## Decisions and trade-offs

I kept URL state and server data loading as the source of truth. Public content is static or SSR, dashboard data is streamed, and mock JSON is validated once at the server boundary.

The campaign store is intentionally in memory, so edits reset when the server restarts. The static public header also avoids session personalization to keep the homepage cacheable.

## Hot take / favorite part

The URL is the best state manager for searchable, shareable tables. My favorite part is the streamed dashboard: the shell remains useful while independent data promises settle.

## What I would improve with more time

I would close the compliance gaps first: performance CI, observability, complete SEO, the remaining homepage sections, and a custom accessible composite. After that, I would replace in-memory mutations with persistent storage and add broader failure-path coverage.
