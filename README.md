# 🛒 Cartora — Modern E-Commerce Platform (Client)

A full-featured, modern e-commerce storefront built with **Next.js 16**, **React 19**, and **TypeScript**. Cartora delivers a premium shopping experience with dark/light theme support, Stripe-powered checkout, real-time notifications, and a full admin dashboard with analytics.

> **🔗 Live Demo:** [cartora-client.vercel.app](https://cartora-client.vercel.app)
>
> **🔗 Backend API:** [cartora-server.vercel.app](https://cartora-server.vercel.app)

---

## 📸 Screenshot

![Cartora Homepage](./public/screenshot.png)

---

## 🚀 Technologies Used

| Layer        | Technology                                                    |
| ------------ | ------------------------------------------------------------- |
| Framework    | [Next.js 16](https://nextjs.org/) (App Router, Turbopack)     |
| Language     | [TypeScript](https://www.typescriptlang.org/)                 |
| UI Library   | [React 19](https://react.dev/)                                |
| Styling      | [Tailwind CSS 4](https://tailwindcss.com/)                    |
| State/Data   | [TanStack React Query 5](https://tanstack.com/query)          |
| Forms        | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Payments     | [Stripe Elements](https://stripe.com/docs/stripe-js)         |
| Animations   | [Framer Motion](https://www.framer.com/motion/)               |
| Charts       | [Recharts](https://recharts.org/)                             |
| Icons        | [Lucide React](https://lucide.dev/)                           |
| Theming      | [next-themes](https://github.com/pacocoursey/next-themes)    |
| Toasts       | [Sonner](https://sonner.emilkowal.dev/)                       |
| HTTP Client  | [Axios](https://axios-http.com/)                              |
| Auth         | [Google OAuth](https://www.npmjs.com/package/@react-oauth/google) |
| Deployment   | [Vercel](https://vercel.com/)                                 |

---

## ✨ Core Features

### 🛍️ Customer Features
- **Product Catalog** — Browse, search, and filter products with category-based navigation
- **Product Detail Pages** — Image galleries, size charts, variant selection, reviews
- **Shopping Cart** — Add, update quantities, remove items with real-time totals
- **Wishlist** — Save favorite products for later
- **Secure Checkout** — Stripe-powered card payments with address management
- **Order Tracking** — View order history and real-time status updates
- **User Dashboard** — Profile management, saved addresses, order history
- **Dark / Light Mode** — System-aware theme toggle with smooth transitions

### 🔐 Admin Features
- **Analytics Dashboard** — Revenue charts, order frequency graphs, category breakdowns (Recharts)
- **Product Management** — Full CRUD: add, edit, delete products with image uploads
- **Order Management** — View all orders, update statuses (processing → shipped → delivered)
- **Real-Time Notifications** — Instant alerts when customers complete purchases

### 🎨 Design & UX
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Micro-Animations** — Framer Motion page transitions and hover effects
- **Premium UI Components** — Custom button, card, input, and dialog components
- **SEO Optimized** — Meta tags, semantic HTML, Open Graph support

---

## 📦 Dependencies

### Production
| Package                          | Purpose                         |
| -------------------------------- | ------------------------------- |
| `next` (16.2.10)                 | React framework (App Router)    |
| `react` / `react-dom` (19.2.4)  | UI library                      |
| `@tanstack/react-query` (5.x)   | Server state management         |
| `axios` (1.x)                   | HTTP client for API calls       |
| `@stripe/react-stripe-js` (6.x) | Stripe payment elements         |
| `@stripe/stripe-js` (9.x)       | Stripe.js loader                |
| `framer-motion` (12.x)          | Animation library               |
| `recharts` (3.x)                | Chart/graph components          |
| `react-hook-form` (7.x)         | Form state management           |
| `zod` (4.x)                     | Schema validation               |
| `next-themes` (0.4.x)           | Dark/light mode                 |
| `sonner` (2.x)                  | Toast notifications             |
| `lucide-react` (1.x)            | Icon library                    |
| `class-variance-authority`       | Component variant styling       |
| `clsx` / `tailwind-merge`       | Conditional class utilities     |
| `@react-oauth/google`           | Google sign-in                  |

### Development
| Package                        | Purpose                    |
| ------------------------------ | -------------------------- |
| `tailwindcss` (4.x)           | Utility-first CSS          |
| `@tailwindcss/postcss`        | PostCSS plugin             |
| `typescript` (5.x)            | Type safety                |
| `eslint` / `eslint-config-next` | Linting                  |
| `prettier`                     | Code formatting            |

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** or **yarn**
- A running instance of the [Cartora Server](https://github.com/actuallyayon/cartora-server)

### 1. Clone the repository
```bash
git clone https://github.com/actuallyayon/cartora-client.git
cd cartora-client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Run the development server
```bash
npm run dev
```

The app will be available at **http://localhost:3000**.

### 5. Build for production
```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login & Register pages
│   ├── (dashboard)/        # User/Admin dashboard
│   ├── about/              # About page
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Stripe checkout flow
│   ├── explore/            # Product catalog
│   ├── items/              # Admin product management
│   ├── products/           # Product detail pages
│   └── ...                 # Other static pages
├── components/
│   └── ui/                 # Reusable UI primitives (Button, Card, Input, etc.)
├── features/               # Feature-based modules
│   ├── analytics/          # Admin analytics dashboard
│   ├── auth/               # Authentication hooks & components
│   ├── cart/               # Cart state & hooks
│   ├── catalog/            # Product listing & detail components
│   ├── notification/       # Notification bell & hooks
│   ├── orders/             # Order hooks
│   ├── wishlist/           # Wishlist hooks
│   └── ...
├── lib/                    # Shared utilities (API client, formatters, etc.)
└── providers/              # React Query, Theme, Auth providers
```

---

## 🔗 Links & Resources

| Resource       | URL                                                                 |
| -------------- | ------------------------------------------------------------------- |
| 🌐 Live Site   | [cartora-client.vercel.app](https://cartora-client.vercel.app)      |
| 🖥️ Backend API | [cartora-server.vercel.app](https://cartora-server.vercel.app)      |
| 📦 Client Repo | [github.com/actuallyayon/cartora-client](https://github.com/actuallyayon/cartora-client) |
| 📦 Server Repo | [github.com/actuallyayon/cartora-server](https://github.com/actuallyayon/cartora-server) |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
