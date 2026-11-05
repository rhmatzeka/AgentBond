import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { WalletConnectButton } from "@/components/wallet-connect-button";

const navLinks = [
  { href: "/#check", label: "Check a seller" },
  { href: "/reports", label: "Reports" },
  { href: "/demo", label: "Sellers" },
  { href: "/#api", label: "API" },
];

const linkClass = "rounded-lg px-3 py-1.5 transition-colors hover:bg-ink hover:text-card";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 sm:px-8">
        <Link className="flex items-center gap-2.5" href="/">
          <BrandMark />
          <span className="display text-lg tracking-tight">AgentBond</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 text-[15px] font-semibold md:flex">
          {navLinks.map((link) => (
            <Link className={linkClass} href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <WalletConnectButton />
      </div>
      <nav
        aria-label="Main mobile"
        className="flex gap-1 overflow-x-auto border-t-2 border-ink px-3 py-2 text-sm font-semibold md:hidden"
      >
        {navLinks.map((link) => (
          <Link className={`whitespace-nowrap ${linkClass}`} href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
