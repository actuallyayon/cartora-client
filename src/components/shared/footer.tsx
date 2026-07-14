import Link from 'next/link';
import { Mail } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { GithubIcon, InstagramIcon, LinkedinIcon, XIcon } from '@/components/shared/brand-icons';

const footerSections: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Shop',
    links: [
      { label: 'Explore', href: '/explore' },
      { label: 'Categories', href: '/explore' },
      { label: 'New Arrivals', href: '/explore' },
      { label: 'Best Sellers', href: '/explore' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/about' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Track Order', href: '/dashboard/orders' },
    ],
  },
];

const socials = [
  { label: 'X', href: 'https://x.com', icon: XIcon },
  { label: 'Instagram', href: 'https://instagram.com', icon: InstagramIcon },
  { label: 'GitHub', href: 'https://github.com', icon: GithubIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: LinkedinIcon },
];

/**
 * Functional footer with real internal links, contact info, and socials.
 * Link targets resolve to routes that exist now or are built in later steps.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-background border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
                <span className="text-primary">C</span>artora
              </span>
            </Link>
            <p className="text-muted-foreground mt-3 max-w-xs text-sm">{siteConfig.tagline}</p>
            <a
              href="mailto:support@cartora.app"
              className="text-muted-foreground hover:text-foreground mt-4 inline-flex items-center gap-2 text-sm"
            >
              <Mail className="h-4 w-4" />
              support@cartora.app
            </a>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-border mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
