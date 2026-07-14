/**
 * Static site configuration: brand identity and navigation.
 * Nav is split by auth state — logged-out users see the public routes,
 * authenticated users additionally get their account areas (wired to auth in Step 4).
 */
export const siteConfig = {
  name: 'Cartora',
  tagline: 'Discover. Compare. Shop Smarter.',
  description:
    'Cartora is a modern shopping experience — discover products, compare with confidence, and check out in seconds.',
  url: 'https://cartora.app',
} as const;

/**
 * Public demo credentials shown on the login page (auto-fill buttons) so
 * graders/recruiters can try both roles instantly. Seeded via the server's
 * `npm run seed`. These are intentionally non-secret.
 */
export const demoAccounts = {
  customer: { email: 'demo@cartora.app', password: 'demo1234' },
  admin: { email: 'admin@cartora.app', password: 'admin1234' },
} as const;

export interface NavLink {
  label: string;
  href: string;
}

// Minimum 3 routes when logged out.
export const publicNavLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// Minimum 5 routes when logged in (used from Step 4 onward).
export const authNavLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'Wishlist', href: '/dashboard/wishlist' },
  { label: 'Orders', href: '/dashboard/orders' },
  { label: 'Profile', href: '/dashboard/profile' },
];
