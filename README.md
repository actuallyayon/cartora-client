# Cartora — Client

Frontend for **Cartora**, a production-grade SaaS e-commerce platform.
_Discover. Compare. Shop Smarter._

> This is a scaffold stub. The full README (architecture, screenshots, env
> table, deployment guide, demo credentials) is completed in the final build step.

## Tech Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · TanStack Query · Axios · React Hook Form + Zod · Framer Motion · shadcn/ui + Lucide · Sonner · Recharts

## Getting Started

```bash
npm install
cp .env.example .env.local   # adjust NEXT_PUBLIC_API_URL if needed
npm run dev                  # http://localhost:3000
```

The client expects the API at `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000/api/v1`).

## Scripts

| Script               | Description                    |
| -------------------- | ------------------------------ |
| `npm run dev`        | Start dev server (Turbopack)   |
| `npm run build`      | Production build               |
| `npm start`          | Serve the production build     |
| `npm run type-check` | Type-check without emitting    |
| `npm run lint`       | Lint (zero warnings allowed)   |
| `npm run format`     | Format with Prettier           |

## Project Structure

```
src/
├─ app/            App Router (layout, providers, routes)
├─ components/
│  ├─ ui/          shadcn primitives
│  ├─ shared/      navbar, footer, theme toggle
│  └─ providers/   theme + react-query providers
├─ features/       Feature modules (auth, products, cart, …)
├─ lib/            axios instance, cn() util
├─ hooks/          Reusable hooks
├─ config/         site config + env access
└─ types/          Shared types
```

## Theming

Light/dark via `next-themes` (class strategy) with oklch design tokens in
`src/app/globals.css`: one brand primary (violet) + a neutral scale.

## License

MIT
