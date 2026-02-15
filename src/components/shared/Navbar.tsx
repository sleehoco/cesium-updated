'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavLink {
  name: string;
  href: string;
}

interface NavDropdown {
  name: string;
  items: NavLink[];
}

interface NavDirect {
  name: string;
  href: string;
}

type NavItem = (NavDropdown & { type: 'dropdown' }) | (NavDirect & { type: 'direct' });

const navItems: NavItem[] = [
  {
    type: 'dropdown',
    name: 'Services',
    items: [
      { name: 'Security Assessment', href: '/services#security-assessment' },
      { name: 'Compliance & Risk Management', href: '/services#compliance-risk' },
      { name: 'Penetration Testing', href: '/services#penetration-testing' },
      { name: 'Cloud Security (M365)', href: '/services#cloud-security-m365' },
      { name: 'AI Integration', href: '/services#ai-business-integration' },
      { name: 'Managed Security', href: '/services#managed-security' },
    ],
  },
  {
    type: 'dropdown',
    name: 'Industries',
    items: [
      { name: 'Healthcare', href: '/industries/healthcare' },
      { name: 'Manufacturing', href: '/industries/manufacturing' },
      { name: 'Legal', href: '/industries/legal' },
      { name: 'Financial Services', href: '/industries/financial' },
      { name: 'Retail & Consumer Business', href: '/industries/retail' },
    ],
  },
  { type: 'direct', name: 'Tools', href: '/tools' },
  { type: 'direct', name: 'About', href: '/about' },
  {
    type: 'dropdown',
    name: 'Resources',
    items: [
      { name: 'Blog / Insights', href: '/blog' },
      { name: 'Compliance Guides', href: '/resources/guides' },
      { name: 'Case Studies', href: '/resources/case-studies' },
    ],
  },
];

function isLinkActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  // Match exact path or hash-link parent path
  const basePath = href.split('#')[0];
  return pathname === basePath || pathname.startsWith(basePath + '/');
}

function isDropdownActive(pathname: string, items: NavLink[]): boolean {
  return items.some((item) => isLinkActive(pathname, item.href));
}

// Desktop dropdown component
function DesktopDropdown({ item, pathname }: { item: NavDropdown & { type: 'dropdown' }; pathname: string }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const active = isDropdownActive(pathname, item.items);

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className={cn(
          'flex items-center gap-1 text-sm font-medium transition-colors hover:text-sky-400',
          active ? 'text-sky-400' : 'text-gray-300'
        )}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        {item.name}
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'absolute left-0 top-full mt-2 w-56 rounded-md bg-navy-800 border border-navy-700 shadow-lg py-1',
          'transition-all duration-200 origin-top-left',
          open
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        )}
        role="menu"
      >
        {item.items.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            role="menuitem"
            className={cn(
              'block px-4 py-2 text-sm transition-colors hover:bg-navy-700 hover:text-sky-400',
              isLinkActive(pathname, link.href) ? 'text-sky-400' : 'text-gray-300'
            )}
            onClick={() => setOpen(false)}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Mobile dropdown component
function MobileDropdown({
  item,
  pathname,
  onNavigate,
}: {
  item: NavDropdown & { type: 'dropdown' };
  pathname: string;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const active = isDropdownActive(pathname, item.items);

  return (
    <div>
      <button
        type="button"
        className={cn(
          'flex w-full items-center justify-between px-3 py-2 rounded-md text-base font-medium transition-colors',
          active ? 'text-sky-400' : 'text-gray-300 hover:text-sky-400 hover:bg-navy-800'
        )}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {item.name}
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="pl-4 py-1 space-y-1">
          {item.items.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'block px-3 py-2 rounded-md text-sm transition-colors',
                isLinkActive(pathname, link.href)
                  ? 'text-sky-400 bg-sky-400/10'
                  : 'text-gray-400 hover:text-sky-400 hover:bg-navy-800'
              )}
              onClick={onNavigate}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur border-b border-navy-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white font-display">
              Cesium<span className="text-sky-400">Cyber</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) =>
              item.type === 'dropdown' ? (
                <DesktopDropdown key={item.name} item={item} pathname={pathname} />
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-sky-400',
                    isLinkActive(pathname, item.href) ? 'text-sky-400' : 'text-gray-300'
                  )}
                >
                  {item.name}
                </Link>
              )
            )}
            <Button variant="accent" size="sm" asChild>
              <Link href="/contact">Get a Free Assessment</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-navy-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 border-t border-navy-700',
          mobileMenuOpen ? 'max-h-[calc(100vh-4rem)] opacity-100' : 'max-h-0 opacity-0 border-t-0'
        )}
      >
        <div className="px-4 py-4 space-y-1">
          {navItems.map((item) =>
            item.type === 'dropdown' ? (
              <MobileDropdown
                key={item.name}
                item={item}
                pathname={pathname}
                onNavigate={closeMobileMenu}
              />
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                  isLinkActive(pathname, item.href)
                    ? 'text-sky-400 bg-sky-400/10'
                    : 'text-gray-300 hover:text-sky-400 hover:bg-navy-800'
                )}
                onClick={closeMobileMenu}
              >
                {item.name}
              </Link>
            )
          )}
          <div className="pt-2">
            <Button variant="accent" size="sm" className="w-full" asChild>
              <Link href="/contact" onClick={closeMobileMenu}>
                Get a Free Assessment
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
