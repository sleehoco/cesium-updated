'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  type NavLink,
  serviceLinks,
  industryLinks,
} from '@/lib/navigation';

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
  { type: 'direct', name: 'Tools', href: '/tools' },
  {
    type: 'dropdown',
    name: 'For Business',
    items: [
      { name: 'Services', href: '/services' },
      ...serviceLinks.slice(0, 3),
      { name: 'Industries', href: '#' },
      ...industryLinks,
    ],
  },
  { type: 'direct', name: 'About', href: '/about' },
];

function isLinkActive(pathname: string, href: string): boolean {
  if (href === '/' || href === '#') return pathname === href;
  const basePath = href.split('#')[0];
  return pathname === basePath || pathname.startsWith(basePath + '/');
}

function isDropdownActive(pathname: string, items: NavLink[]): boolean {
  return items.some((item) => isLinkActive(pathname, item.href));
}

function DesktopDropdown({ item, pathname }: { item: NavDropdown & { type: 'dropdown' }; pathname: string }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const active = isDropdownActive(pathname, item.items);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className={cn(
          'flex items-center gap-1 text-sm font-medium transition-colors hover:text-violet-400',
          active ? 'text-violet-400' : 'text-gray-300'
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
          'absolute left-0 top-full mt-2 w-56 rounded-md bg-neutral-900/95 backdrop-blur-xl border border-white/10 shadow-lg py-1',
          'transition-all duration-200 origin-top-left',
          open
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        {item.items.map((link) =>
          link.href === '#' ? (
            <div
              key={link.name}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mt-1"
            >
              {link.name}
            </div>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'block px-4 py-2 text-sm transition-colors hover:bg-white/5 hover:text-violet-400',
                isLinkActive(pathname, link.href) ? 'text-violet-400' : 'text-gray-300'
              )}
              onClick={() => setOpen(false)}
            >
              {link.name}
            </Link>
          )
        )}
      </div>
    </div>
  );
}

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
          active ? 'text-violet-400' : 'text-gray-300 hover:text-violet-400 hover:bg-white/5'
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
          {item.items.map((link) =>
            link.href === '#' ? (
              <div
                key={link.name}
                className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                {link.name}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-sm transition-colors',
                  isLinkActive(pathname, link.href)
                    ? 'text-violet-400 bg-violet-400/10'
                    : 'text-gray-400 hover:text-violet-400 hover:bg-white/5'
                )}
                onClick={onNavigate}
              >
                {link.name}
              </Link>
            )
          )}
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
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white font-display">
              Cesium<span className="text-violet-400">Cyber</span>
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
                    'text-sm font-medium transition-colors hover:text-violet-400',
                    isLinkActive(pathname, item.href) ? 'text-violet-400' : 'text-gray-300'
                  )}
                >
                  {item.name}
                </Link>
              )
            )}
            <Button variant="glow" size="sm" asChild>
              <Link href="/#access">Enter Code</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5"
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
          'md:hidden overflow-hidden transition-all duration-300 border-t border-white/5',
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
                    ? 'text-violet-400 bg-violet-400/10'
                    : 'text-gray-300 hover:text-violet-400 hover:bg-white/5'
                )}
                onClick={closeMobileMenu}
              >
                {item.name}
              </Link>
            )
          )}
          <div className="pt-2">
            <Button variant="glow" size="sm" className="w-full" asChild>
              <Link href="/#access" onClick={closeMobileMenu}>
                Enter Code
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
