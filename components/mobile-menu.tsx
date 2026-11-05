"use client";

import { ArrowRightIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";

/** Menu button for phones and tablets: opens the nav as a full-width sheet under the header. */
export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  // Close on Escape, and stop the page scrolling under the sheet while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        aria-controls="mobile-nav"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-full items-center border-l border-line px-4 transition-colors hover:bg-card sm:px-6"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? <XIcon className="h-6 w-6" /> : <ListIcon className="h-6 w-6" />}
      </button>

      {open && (
        <nav
          aria-label="Main mobile"
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-line bg-paper sm:top-20"
          id="mobile-nav"
        >
          <ul className="divide-y divide-line border-b border-line">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  className="flex items-center justify-between px-5 py-5 text-2xl transition-colors hover:bg-card sm:px-8"
                  href={link.href}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                  <ArrowRightIcon className="h-6 w-6 text-graphite" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-5 py-8 sm:px-8">
            <Link className="nb-btn nb-btn-primary w-full" href="/#check" onClick={() => setOpen(false)}>
              Run a free check
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
