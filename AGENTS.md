# AGENTS.md — Frain Web

Guidelines for AI agents working in this repository.

## Project Overview

Frain is a Next.js 16 web application for visualizing software architecture as C4 model diagrams.
It communicates with a separate backend API (`BACKEND_API_URL`) for domain logic.

**Stack:** Next.js 16 · React 19 · TypeScript · Bun · Prisma 7 (PostgreSQL) · Tailwind CSS v4 · Biome 2 · NextAuth v5 · shadcn/ui (new-york style)

## Build, Lint & Dev Commands

```bash
bun run dev          # Start Next.js dev server
bun run build        # Production build
bun run start        # Start production server
bun run lint         # Biome check (lint + format check)
bun run format       # Biome format --write (auto-fix formatting)
```

### Database (Prisma)

```bash
bun run db:generate  # Generate Prisma client
bun run db:migrate   # Run migrations (dev)
bun run db:push      # Push schema to DB without migration
bun run db:studio    # Open Prisma Studio
```

### Tests

No test framework is configured. When adding tests, use Vitest (preferred for Bun/Next.js).

### Adding UI Components

```bash
bunx shadcn@latest add <component>           # From @shadcn registry
bunx shadcn@latest add @svgl/<name>          # Brand SVG icons
```

Registries configured: `@shadcn` (default), `@svgl` (brand SVGs via svgl.app).
Magic UI components are also available via the shadcn MCP.

## Code Style & Formatting

Enforced by **Biome 2** (`biome.json`). No ESLint or Prettier.

- **Indentation:** 4 spaces
- **Quotes:** Double quotes (default Biome)
- **Semicolons:** Always (default Biome)
- **Trailing commas:** All (default Biome)
- **Import organization:** Auto-sorted by Biome assist
- **Max line length:** Not enforced, but keep lines reasonable (~100 chars)

Run `bun run format` before committing. Run `bun run lint` to check.

## TypeScript Conventions

- **Strict mode** enabled (`tsconfig.json`)
- **Path alias:** `@/` maps to `src/` — always use `@/` imports, never relative `../`
- **Types over interfaces** for simple shapes; **interfaces** for objects with methods or extension
- **Explicit return types** on exported functions and server actions
- **No `any`** — use `unknown` with type guards if type is uncertain
- **React 19 patterns:**
  - Use `use(Context)` instead of `useContext(Context)`
  - No `forwardRef` — `ref` is a regular prop in React 19
  - `useActionState` for form state management
- **React Compiler** is enabled (`reactCompiler: true` in next.config.ts) — avoid manual `useMemo`/`useCallback` unless profiling shows need

## Naming Conventions

| Thing             | Convention       | Example                        |
|-------------------|------------------|--------------------------------|
| Files/folders     | kebab-case       | `app-sidebar.tsx`, `auth.ts`   |
| Components        | PascalCase       | `AppSidebar`, `OAuthButtons`   |
| Functions/vars    | camelCase        | `loginAction`, `getInitials`   |
| Types/Interfaces  | PascalCase       | `AuthResult`, `MemberResponse` |
| Constants         | camelCase        | `navigation`, `features`       |
| Server actions    | camelCase + verb | `loginAction`, `signOutAction` |
| CSS variables     | kebab-case       | `--font-geist-sans`            |

## Project Architecture

### Directory Structure

```
src/
├── actions/         # Server actions (auth)
├── app/             # Next.js App Router pages & layouts
├── components/      # Shared components
│   └── ui/          # shadcn/ui primitives (auto-generated, avoid editing)
├── generated/       # Prisma generated client (do not edit)
├── hooks/           # Custom React hooks
├── lib/             # Utilities: auth.ts, api.ts, prisma.ts, utils.ts
└── services/        # Backend API client layer
    └── <domain>/    # controller.ts, actions.ts, types.ts
```

### Service Layer Pattern

Each backend domain follows a three-file pattern in `src/services/<domain>/`:

- **`types.ts`** — Request/response interfaces
- **`actions.ts`** — `"use server"` functions that call the backend API via axios
- **`controller.ts`** — Static class facade re-exporting actions (used by components)

When adding a new backend integration, follow this pattern exactly.

### Server Actions

- Files must start with `"use server"` directive
- Return typed result objects (e.g., `AuthResult = { error?: string; success?: boolean }`)
- Validate inputs before processing
- Handle errors gracefully — return error messages, don't throw to the client

### Component Patterns

- **Server Components** by default (no directive needed)
- **Client Components** only when using hooks, event handlers, or browser APIs — add `"use client"` directive
- Use **compound components** for complex UI (see `.agents/skills/vercel-composition-patterns/`)
- Avoid boolean prop proliferation — compose explicit variants instead
- Use `cn()` from `@/lib/utils` for conditional class merging (clsx + tailwind-merge)

### Styling

- **Tailwind CSS v4** — configured via CSS imports, no `tailwind.config.ts`
- **Color system:** oklch-based with CSS custom properties (light/dark themes)
- **Dark mode:** class-based via `next-themes`, default theme is dark
- **Component library:** shadcn/ui (new-york variant), installed to `src/components/ui/`
- Prefer Tailwind utility classes over custom CSS

## Error Handling

- **Server actions:** Return `{ error: string }` objects; never throw raw errors to the client
- **Client-side:** Use `toast.error()` from `sonner` to display errors
- **API calls:** The axios instance in `src/lib/api.ts` auto-injects auth tokens; handle axios errors in server actions
- **Auth errors:** Check `instanceof AuthError` and inspect `error.type`

## Authentication

- **NextAuth v5** with JWT strategy (not database sessions)
- Providers: Credentials, GitHub, Google
- Auth config in `src/lib/auth.ts` (full Node.js) and `src/lib/auth.config.ts` (edge-safe)
- Protected routes handled via `src/proxy.ts` (auth config authorized callback)
- Session accessed server-side via `await auth()`, client-side via props or server component data passing

## Agent Skills

The `.agents/skills/` directory contains detailed guidelines. Load these skills when relevant:

- **vercel-composition-patterns** — Compound components, lifting state, dependency injection via context, explicit variants, React 19 APIs
- **vercel-react-best-practices** — Performance: eliminate waterfalls, bundle size, server-side, re-renders, rendering
- **web-design-guidelines** — UI/UX accessibility and design review

## Key Libraries

| Library            | Purpose                              |
|--------------------|--------------------------------------|
| `next-auth`        | Authentication (v5 beta)             |
| `prisma`           | Database ORM (PostgreSQL)            |
| `axios`            | HTTP client for backend API          |
| `sonner`           | Toast notifications                  |
| `lucide-react`     | Icon library                         |
| `next-themes`      | Theme switching (light/dark)         |
| `bcryptjs`         | Password hashing                     |
| `class-variance-authority` | Component variant styling     |
| `next-cloudinary`  | Cloudinary image upload integration  |

## Environment Variables

Required in `.env` (never commit):

- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — NextAuth secret
- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` — GitHub OAuth
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — Google OAuth
- `BACKEND_API_URL` — Backend API base URL
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
