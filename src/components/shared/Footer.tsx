import Link from 'next/link';
import { Shield } from 'lucide-react';
import {
  serviceLinks,
  toolLinks,
  industryLinks,
  companyLinks,
  legalLinks,
} from '@/lib/navigation';

function FooterColumn({ title, links }: { title: string; links: { name: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-gray-500 hover:text-white transition-colors"
    >
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="bg-charcoal-950 border-t border-white/5">
      <div className="container mx-auto px-4 pt-16 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
          {/* Logo + tagline */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 mb-4 lg:mb-0">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="h-7 w-7 text-violet-400" />
              <span className="text-lg font-bold text-white font-display">
                Cesium<span className="text-violet-400">Cyber</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[220px]">
              Enterprise-grade security tools for everyone.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-4 mt-6">
              <SocialIcon href="https://x.com" label="X (Twitter)">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://www.linkedin.com/company/cesium-cybersecurity-and-solutions-llc" label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://www.youtube.com/@PodForgePodcast" label="PodForge Podcast on YouTube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Services */}
          <FooterColumn title="Services" links={serviceLinks} />

          {/* Tools */}
          <FooterColumn title="Tools" links={toolLinks} />

          {/* Industries */}
          <FooterColumn title="Industries" links={industryLinks} />

          {/* Company */}
          <FooterColumn
            title="Company"
            links={[
              ...companyLinks,
              { name: 'information@cesiumcyber.com', href: 'mailto:information@cesiumcyber.com' },
              { name: '+1 (717) 543-4981', href: 'tel:+17175434981' },
            ]}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 mt-12 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} CesiumCyber. All rights reserved.
            </p>

            {/* Legal links */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {legalLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
