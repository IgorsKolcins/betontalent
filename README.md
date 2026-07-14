# Bet On Talent frontend take-home assessment

A SvelteKit dashboard built for the senior frontend take-home assessment.

**Author**: Igors Kolčins

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

## Quality checks

Run the same checks used by CI:

```bash
npm run check
npm run lint
npm test
```

`npm test` runs the Vitest unit/component suite followed by the Playwright end-to-end suite.

Test coverage includes:

- **Business logic** — URL-state parsing for blog search and campaign filters, post queries, and campaign status rules.
- **Server behavior** — API client responses, authenticated sessions, authorization failures, and validation errors.
- **Components and page states** — reusable form/navigation components, search results, dashboard loading and error states, and optimistic-edit rollback.
- **Anonymous E2E journey** — searching for a post, opening the result, and returning to the preserved search state.
- **Authenticated E2E journey** — signing in, navigating the dashboard, editing a campaign, and verifying success and rollback paths.
- **Quality safeguards** — Axe accessibility assertions on the dashboard and a Playwright visual regression snapshot of search results.

## CI/CD

Pull requests targeting `main` start three independent GitHub Actions workflows in parallel:

- **Check** — runs `svelte-check` and TypeScript diagnostics through `npm run check`.
- **Lint** — runs Prettier and ESLint through `npm run lint`.
- **Test** — runs the Vitest and Playwright suites through `npm test`.

Superseded runs are cancelled when a new commit is pushed to the pull request. The three checks should be configured as required status checks in the `main` branch protection rule. Vercel remains responsible for preview and production deployments; merging to `main` is the production deployment boundary.

## Demo login

Use `admin@demo.test`, `editor@demo.test`, or `viewer@demo.test` with password `demo1234`.

---

## Comments and decisions

This is too big of a task for a take-home assignment with a long list of required points. But some of them are interesting, like enforcing bundle-size budgets and using the View Transitions API, and encourage thinking beyond simply building the requested screens. I was also surprised to see deployment and a CI/CD pipeline included as requirements for a frontend position, although they do make the exercise feel closer to real production work.

p.s. Attached .html with task description feels too vibe-coded.

### Time spent

~12 hours

### What I implemented

- Homepage components and localized public routes for the blog, article, search, and custom error page, with URL-synced search, filtering, sorting, and pagination.
- Signed cookie authentication, shared client/server Zod validation, protected dashboard routes, and role-based campaign editing.
- A streamed dashboard table with server-side queries, loading/empty/error states, and optimistic status updates with rollback.
- EN/DE routing, token-based light/dark themes, reusable UI primitives, validated mock-data contracts, and locale-aware formatting.
- Deliberate SSG, SSR, streamed SSR, Edge, and Node runtime boundaries.
- Vitest component/business-logic coverage plus Playwright anonymous and authenticated flows, Axe checks, and a visual snapshot.
- Parallel GitHub Actions checks for Svelte/TypeScript diagnostics, linting, unit tests, and end-to-end tests on pull requests to `main`.
- Manual Lighthouse audits pass the required scores and Core Web Vitals budgets; the dashboard passes its manual `size-limit` check at ≤150 kB.

### What I did not implement

- **Performance budgets are not implemented in CI/CD.** Lighthouse and `size-limit` checks currently require a manual run.
- **The public-page JavaScript budget is not met.** It is approximately 127 kB against a 50 kB limit.
- Pre-commit hooks, RUM, and client error reporting.
- Complete SEO coverage: social metadata, homepage JSON-LD, article sitemap entries, and generated OG images.
- A fully hand-built complex accessible composite; the dialog/drawer uses Bits UI primitives.
- The optional offline shell, partial prerendering, and SSR feature flag.

### Decisions and trade-offs

- I kept URL state and server data loading as the source of truth. Public content is static or SSR, dashboard data is streamed, and mock JSON is validated once at the server boundary.
- The campaign store is intentionally in memory, so edits reset when the server restarts. The static public header also avoids session personalization to keep the homepage cacheable.
- I chose GitHub Actions for pull-request quality gates and Vercel for deployment. The workflows run independently to reduce feedback time, while Vercel's SvelteKit adapter provides the required per-route Edge and Node runtime split plus Git-based preview and production deployments. Lighthouse and bundle-budget gates remain manual.

### Challenges encountered

Paraglide's localized URL routing exposed a Vercel-specific integration issue similar to [opral/paraglide-js#32](https://github.com/opral/paraglide-js/issues/32). Locale-prefixed SSR routes such as `/en/blog`, `/en/search`, and `/en/login` worked in development and with `vite preview`, but returned 404 after deployment. Vercel selected a runtime-specific function before SvelteKit's `reroute` hook ran, so localized paths fell through to a catch-all function whose manifest did not contain the requested route.

The app uses a small wrapper around `adapter-vercel` that augments the generated Vercel routing table with locale-prefixed aliases. Each alias targets the same function as its unprefixed route while preserving the localized request URL for Paraglide. This keeps localized SSR and SvelteKit `__data.json` requests working without sacrificing the required Edge and Node runtime split.

### Major package decisions

- **SvelteKit Superforms** — progressive login forms with one client/server validation flow.
- **Paraglide JS** — type-safe, compiled translations with locale-aware URLs.
- **Bits UI** — accessible dialog behavior while keeping markup and styling local.
- **Vercel adapter** — one deployment target for per-route Edge and Node runtimes, while GitHub Actions owns pull-request quality checks.
- **Vitest, Playwright, and Axe** — fast unit/component tests plus real-browser flow and accessibility coverage.

### Hot take / favorite part

Using classes with Svelte runes is a hidden gem. [`ThemeContext`](src/lib/contexts/Theme.svelte.ts) shows how classes work natively with Svelte reactivity, making complex business or behavior logic easy to isolate, reuse, and test. They also integrate naturally with context: reactive context without boilerplate—something React can only dream about.

### What I would improve with more time

I would close the remaining compliance gaps first: observability, complete SEO, pre-commit checks, and a custom accessible composite. After that, I would replace in-memory mutations with persistent storage and add broader failure-path coverage.

This was my first time using Paraglide with SvelteKit. Previously, I had always used the more traditional [`sveltekit-i18n`](https://github.com/sveltekit-i18n/lib) approach with an optional root `[[lang]]` route. With more time, I would explore Paraglide's configuration more deeply and have a better understanding of its trade-offs.
