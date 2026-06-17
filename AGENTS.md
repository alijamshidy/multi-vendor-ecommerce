# AGENTS.md

Guide for AI coding agents working in this repository.

## Project summary

Multi-vendor e-commerce **frontend** built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, and Zustand. It talks to a **Marketplace API** (Node.js, port 5000) at `/api/`. Supports English and Persian (`fa`) with RTL, and three auth roles: `admin`, `seller`, `customer`.

**Package manager:** `pnpm` (lockfile: `pnpm-lock.yaml`, Docker uses pnpm 9.15.9).

**Path alias:** `@/*` maps to the repo root (`tsconfig.json`).

---

## Commands

```bash
pnpm install          # install dependencies
pnpm dev              # dev server → http://localhost:3000
pnpm build            # production build (standalone output)
pnpm start            # run production build
pnpm lint             # ESLint (eslint-config-next)
docker compose up --build   # frontend on port 3002
```

Before testing API-dependent features, ensure the Marketplace API is running on `http://localhost:5000`.

---

## Environment variables

Create `.env.local` for local development:

| Variable | Required | Purpose |
|----------|----------|---------|
| `MARKETPLACE_API_URL` | recommended | Server-side API origin, e.g. `http://localhost:5000` |
| `NEXT_PUBLIC_MARKETPLACE_API_URL` | recommended | Public API origin for media URLs |
| `NEXT_PUBLIC_WEBSITE_URL` | recommended | Public site URL (sharing links), e.g. `http://localhost:3000` |

**Docker note:** Inside the container, `MARKETPLACE_API_URL` must be `http://host.docker.internal:5000`, not `localhost`. See `docker-compose.yml`.

---

## Architecture

### Request flow

```
Browser  →  axios baseURL `/api`  →  app/api/[...path]/route.ts  →  Marketplace API
SSR/Server  →  axios baseURL `http://localhost:5000/api`  →  Marketplace API (direct)
```

- Client HTTP client: `lib/axios.ts`
- Server proxy: `lib/api-proxy.ts` via `app/api/[...path]/route.ts`
- Do **not** point browser code directly at `localhost:5000`; always use the same-origin proxy.

### Middleware / routing (`proxy.ts`)

`proxy.ts` at the repo root handles:

1. **i18n** — `next-intl` locale prefix (`en`, `fa`)
2. **Auth gate** — reads `accessToken` and `authRole` cookies
3. **Role checks** — `/admin/*` requires `admin`; customer routes redirect admins

Public paths include: home, login, register, products, categories, contact, reviews, reset_password.

Protected segments: `admin`, `seller`, `customer`, `dashboard`, `cart`, `checkout`, `orders`, `wishlist`, `profile`.

When adding new routes, update `publicPaths` or `protectedFirstSegments` in `proxy.ts` if access rules change.

### Auth model

| Concern | Location |
|---------|----------|
| Token storage | `localStorage.accessToken` + cookie `accessToken` |
| Role cookie | `authRole`: `admin` \| `seller` \| `customer` |
| Role derivation | `lib/auth-cookie.ts` → `deriveAuthRole(user)` |
| Client session | `store/authStore.ts` (Zustand + persist) |
| Post-login redirect | `redirectAfterAuth()` — full page navigation so `proxy.ts` sees cookies |

Role mapping from Django user:

- `is_superuser` or `is_staff` → `admin`
- `is_owner` → `seller`
- otherwise → `customer`

Auth API paths use trailing slashes (Django convention), e.g. `/auth/login-password/`. Pass `{ skipAuth: true }` on axios config for public auth endpoints.

After login/register success, use `redirectAfterAuth(destination)` — not client-side router alone — so middleware receives fresh cookies.

### API response shapes

Types: `lib/api-types.ts`

Helpers: `lib/api-utils.ts`

- `ApiSuccessResponse<T>` — `{ message, data }`
- `PaginatedResponse<T>` — `{ count, next, previous, results }`
- `unwrapList(data)` — handles array or paginated `results`
- `unwrapEntity<T>(data)` — unwraps `{ data: T }` wrapper
- `getApiErrorMessage(error, fallback)` — user-facing errors (handles Django Persian/English throttle messages)
- `resolveMediaUrl(url)` — prepends `API_ORIGIN` to relative media paths

Map API models to UI types in `lib/mappers.ts` (e.g. `mapProduct`, `mapCategory`, `mapCartItem`).

---

## Directory structure

```
app/
  layout.tsx                    # root html/body, Providers
  providers.tsx                 # ThemeProvider, Toaster, devtools init
  [locale]/
    layout.tsx                  # next-intl provider, dir/lang, LocaleSync
    (auth)/                     # login, register, reset_password — minimal layout
    (default)/                  # main storefront + dashboards
      layout.tsx                # SidebarProvider, LayoutContent
      admin/                    # admin-only pages
      seller/                   # seller-only pages
      customer/                 # customer dashboard
      products/, cart/, checkout/, orders/, ...
  api/
    v1/[...path]/route.ts       # Django proxy (GET/POST/PUT/PATCH/DELETE)
    products/route.ts           # legacy external API route (optional env)

components/
  Global/                       # site chrome: Header, Navbar, Container, AppSidebar, Footer
  layout/                       # layout helpers: breadcrumbs, theme, search
  pages/                        # page-level client components (*PageContent)
  auth/                         # login, register, reset forms
  products/, commerce/, cart/   # feature components
  form/                         # reusable form inputs
  ui/                           # shadcn-style primitives (USE THIS in feature code)
  ui-rtl/                       # RTL mirror of ui/ — internal only, not imported from features

store/                          # Zustand stores (one domain per file)
lib/                            # axios, auth, api helpers, mappers, product-query
i18n/                           # routing, navigation, request config
messages/                       # en.json, fa.json — keep in sync
hooks/                          # use-store-init, use-auth-paths, use-query-params
utils/                          # schemas (Zod), format helpers, static category data
proxy.ts                        # i18n + auth middleware
```

---

## Coding conventions

### Pages vs content components

Keep `app/**/page.tsx` thin. Put interactive logic in `components/pages/*PageContent.tsx`:

```tsx
// app/[locale]/(default)/products/page.tsx
export default function Page() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageContent />
    </Suspense>
  );
}
```

Use `<Suspense>` when the content uses `useSearchParams()`.

### Zustand stores

Pattern used across `store/*.ts`:

1. Import `api` from `@/lib/axios`
2. Map responses with `lib/mappers.ts`
3. Use `createLoadingState([...])` for per-action loading flags
4. Use `getApiErrorMessage(error, fallback)` in catch blocks
5. Wrap with `devtools(..., withStoreDevtools("storeName"))`
6. Export default hook, e.g. `useProductStore`

Initialize data in client pages with:

- `useStoreInit(fn, deps)` — re-runs on route change
- `useStoreInitOnce(fn, deps)` — runs once on mount

### Client vs server components

- Add `"use client"` only when needed (hooks, events, Zustand, browser APIs)
- Server components: use `getTranslations` from `next-intl/server`
- Client components: use `useTranslations("namespace")`

Locale layout sets `dir` and `lang` on a wrapper div; `LocaleSync` also updates `document.documentElement`.

### i18n

- Config: `i18n/routing.ts` — locales `["en", "fa"]`, default `"en"`
- Locale-aware navigation: import `{ Link, useRouter, usePathname }` from `@/i18n/navigation`
- Auth paths: `hooks/use-auth-paths.ts` builds locale-prefixed URLs
- **Always add keys to both** `messages/en.json` and `messages/fa.json`

### UI components

- Use `@/components/ui/*` for buttons, inputs, cards, sidebar, etc.
- Do **not** import from `@/components/ui-rtl/*` in feature code — that folder is a mirrored copy for RTL-specific primitives
- Toast notifications: `sonner` via `@/components/ui/sonner`
- Theming: `next-themes` with `class` attribute (`app/providers.tsx`)

### Forms

- Client forms with Zustand actions: controlled inputs + store methods (see `components/auth/`)
- Server actions pattern: `components/form/FormContainer.tsx` with `useActionState`
- Validation schemas: `utils/schemas.ts` (Zod)

### Styling

- Tailwind CSS 4 via `app/globals.css`
- Use existing spacing patterns: `mx-[4%]`, `SidebarInset`, `Container`
- Icons: `lucide-react`, `@radix-ui/react-icons`, `react-icons`
- Dark mode: `next-themes`, toggle in layout components

---

## Backend API endpoints (used by stores)

| Domain | Endpoints |
|--------|-----------|
| Auth | `/auth/login-password/`, `/auth/register/`, `/auth/request-otp/`, `/auth/verify-otp/`, `/auth/reset-password-request/`, `/auth/reset-password-confirm/` |
| Products | `/products/`, `/products/{id}/`, `/products/{id}/comments/`, `/products/{id}/rating/` |
| Categories | `/categories/`, `/categories/{slug}/` |
| Cart / orders | `/ordering/cart/`, `/ordering/cart/items/`, checkout via cart store |
| Management | `/managements/products/`, `/managements/products/images/`, `/managements/categories/` |

All paths expect trailing slashes. Backend is Django REST — error bodies may include Persian text.

---

## Do

- Use `pnpm`, not npm/yarn, unless explicitly asked
- Use `@/` imports consistently
- Add API types to `lib/api-types.ts` and mappers to `lib/mappers.ts`
- Handle errors with `getApiErrorMessage`
- Keep changes scoped — match existing file style and naming
- Run `pnpm lint` after substantive edits
- Use locale-aware `Link` from `@/i18n/navigation` for internal navigation in new code
- Preserve trailing slashes on API paths

## Do not

- Do not commit `.env`, `.env.local`, or secrets
- Do not call Django directly from browser-side code — use `/api/v1`
- Do not add new dependencies without good reason
- Do not create `middleware.ts` — routing/auth lives in `proxy.ts`
- Do not remove or add `#region agent log` debug blocks unless fixing/debugging that specific issue
- Do not assume Cloudinary works — `utils/cloudinary.ts` currently throws; image upload goes through FormData to Django management endpoints
- Do not use `ui-rtl/` in feature components
- Do not create empty commits or unrelated refactors alongside a task

---

## Common pitfalls

| Symptom | Cause / fix |
|---------|-------------|
| `502 Unable to reach the API server` | Django not running on port 8000, or wrong `API_URL` in Docker |
| Redirect loop or stuck on login | Cookies not set; use `redirectAfterAuth` after login |
| 401 clears session unexpectedly | Cart endpoints allow guest 401 — see axios interceptor in `lib/axios.ts` |
| Hydration mismatch on `dir`/`lang` | Root `app/layout.tsx` uses `lang="en" dir="ltr"`; locale layout + `LocaleSync` override client-side |
| `useSearchParams` build error | Wrap component in `<Suspense>` in the page |
| Admin blocked from customer pages | By design in `proxy.ts` — admins redirect to admin dashboard |
| Case-sensitive imports on Linux | Folder is `components/Global/` (capital G) — match exact casing |

---

## Build & deploy

- `next.config.ts`: `output: "standalone"` for Docker
- Docker multi-stage build in `Dockerfile` (deps → builder → runner)
- Images: `remotePatterns` allows `images.pexels.com`; `unoptimized: true`
- Production start: `node server.js` inside standalone output

---

## File reference (quick lookup)

| Need to… | Start here |
|----------|------------|
| Add a protected route | `proxy.ts` + `app/[locale]/(default)/...` |
| Add API call | `lib/axios.ts` + relevant `store/*.ts` |
| Add translation | `messages/en.json` + `messages/fa.json` |
| Add UI primitive | `components/ui/` (shadcn pattern) |
| Change auth flow | `store/authStore.ts`, `lib/auth-cookie.ts`, `proxy.ts` |
| Change product listing filters | `lib/product-query.ts`, `components/products/Filter.tsx` |
| Add breadcrumb | `context/breadcrumb-context.tsx`, `components/layout/AppBreadcrumb.tsx` |

---

## Scope boundaries

This repo is **frontend only**. The Django backend, database, and deployment of the API live elsewhere. When backend behavior is unclear, infer from existing store/API usage and `lib/api-types.ts` rather than inventing new response shapes.
