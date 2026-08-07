"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--line)] bg-[#fffdfb]/92 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-6 py-3">
        <Link href="/" className="la-title text-lg font-semibold tracking-[0.02em] text-[#b15f79] transition-colors hover:text-[#9a5068]" onClick={closeMenu}>
          Lexies Scrubs
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] px-3 py-2 text-sm font-semibold text-[#4a5f75] md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-site-menu"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="sr-only">Menu</span>
          <span aria-hidden="true" className="flex flex-col gap-1">
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
          </span>
        </button>

        <nav className="hidden flex-wrap items-center justify-end gap-2 text-sm font-semibold text-[#4a5f75] md:flex md:gap-3">
          <Link href="/" className="rounded-full border border-transparent px-3 py-1.5 transition-colors hover:border-[color:var(--line)] hover:bg-[#f7f0f5] hover:text-[#2d4258] hover:underline hover:decoration-[rgba(184,111,136,0.5)] hover:underline-offset-4">Home</Link>
          <Link href="/facts" className="rounded-full border border-transparent px-3 py-1.5 transition-colors hover:border-[color:var(--line)] hover:bg-[#eef5fa] hover:text-[#2d4258] hover:underline hover:decoration-[rgba(94,131,159,0.5)] hover:underline-offset-4">All Facts</Link>
          <Link href="/myth-or-truth" className="rounded-full border border-transparent px-3 py-1.5 transition-colors hover:border-[color:var(--line)] hover:bg-[#f7f0f5] hover:text-[#2d4258] hover:underline hover:decoration-[rgba(184,111,136,0.5)] hover:underline-offset-4">Myth or Truth</Link>
          <Link href="/about" className="rounded-full border border-transparent px-3 py-1.5 transition-colors hover:border-[color:var(--line)] hover:bg-[#eef5fa] hover:text-[#2d4258] hover:underline hover:decoration-[rgba(94,131,159,0.5)] hover:underline-offset-4">About</Link>
          <Link href="/contact" className="rounded-full border border-transparent px-3 py-1.5 transition-colors hover:border-[color:var(--line)] hover:bg-[#f7f0f5] hover:text-[#2d4258] hover:underline hover:decoration-[rgba(184,111,136,0.5)] hover:underline-offset-4">Contact</Link>
        </nav>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-site-menu"
          className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 pb-4 md:hidden"
        >
          <Link href="/" onClick={closeMenu} className="rounded-2xl border border-[color:var(--line)] px-4 py-3 text-sm font-semibold text-[#4a5f75] transition-colors hover:bg-[#f7f0f5] hover:text-[#2d4258]">Home</Link>
          <Link href="/facts" onClick={closeMenu} className="rounded-2xl border border-[color:var(--line)] px-4 py-3 text-sm font-semibold text-[#4a5f75] transition-colors hover:bg-[#eef5fa] hover:text-[#2d4258]">All Facts</Link>
          <Link href="/myth-or-truth" onClick={closeMenu} className="rounded-2xl border border-[color:var(--line)] px-4 py-3 text-sm font-semibold text-[#4a5f75] transition-colors hover:bg-[#f7f0f5] hover:text-[#2d4258]">Myth or Truth</Link>
          <Link href="/about" onClick={closeMenu} className="rounded-2xl border border-[color:var(--line)] px-4 py-3 text-sm font-semibold text-[#4a5f75] transition-colors hover:bg-[#eef5fa] hover:text-[#2d4258]">About</Link>
          <Link href="/contact" onClick={closeMenu} className="rounded-2xl border border-[color:var(--line)] px-4 py-3 text-sm font-semibold text-[#4a5f75] transition-colors hover:bg-[#f7f0f5] hover:text-[#2d4258]">Contact</Link>
        </nav>
      )}
    </header>
  );
}
