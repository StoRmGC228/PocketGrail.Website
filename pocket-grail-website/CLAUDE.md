# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Type-check (tsc -b) then Vite production build
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

There are no tests configured in this project.

## Environment

Requires `.env.local` with:

```
VITE_API_BASE_URL=https://localhost:7228/api
```

## Architecture

React 19 + TypeScript SPA using Vite, Redux Toolkit, RTK Query, React Router v7, and Tailwind CSS v4.

### Routing (`src/App.tsx`)

All routes are defined in `App.tsx`. Protected routes are wrapped in `ProtectedLayout` (redirects unauthenticated users to `/auth`). Public-only routes use `PublicOnlyRoute`.

```
/auth              → AuthPage (login/register/verify)
/                  → HomePage
/my-campaigns      → MyCampaignsPage
/campaigns         → ActiveCampaignsPage
/campaigns/:id     → CampaignPage
/join/:code        → JoinRedirectPage
```

### Auth Flow (`src/hooks/useAuthInit.ts`)

Two-phase initialization to avoid UI flash:

1. Sync: Read `pg_user` cookie → populate Redux state
2. Async: `GET /Auth/me` → verify session with backend
3. Set `rehydrated: true` → render protected UI

The `rehydrated` flag in `authSlice` gates route rendering. Cookie TTL is 180 days.

### State Management

Redux Toolkit with RTK Query:

- `authSlice` — user object, `isAuthenticated`, `rehydrated`
- `authApi` — endpoints: register, login, verify, me, logout
- `campaignApi` — endpoints: list, mine, get by id/code, create, join, leave, delete

RTK Query uses tag-based cache invalidation (e.g., creating a campaign invalidates `MyCampaigns`).

### API Layer (`src/api/`)

All requests go through RTK Query services. Credentials are included (cookie-based sessions). Base URL comes from `VITE_API_BASE_URL`.

Endpoint format: `Auth/*`, `Campaigns/*`

### Styling

Tailwind v4 with custom CSS variables defined in `index.css`. Dark theme set globally via `document.documentElement.dataset.theme = 'dark'` in `main.tsx`. Custom colors use `--color-bg`, `--color-nb`, etc.

### Key Conventions

- Types live in `src/types/` — `auth.ts` and `campaign.ts`
- Cookie utilities in `src/utils/authCookie.ts`
- Components organized by domain under `src/components/`
- New pages go in `src/pages/`, register the route in `App.tsx`
- User roles are string literals: `'Player'` | `'DungeonMaster'`

Ось інструкція англійською для вашого `CLAUDE.md`:

## CSS Styles

If you need to define a CSS class, always do it in a separate CSS file.  
If a file named after the component does not exist yet — create it in same directory and write the styles there.

**Example:** for `Button.tsx` → styles go in `Button.css`

## TSX files

When you create .tsx or .jsx file, first create a folder for it.

**Example:** if you want to create `Button.tsx` -> first create `Button` folder in this directory and then there create `Button.tsx`
