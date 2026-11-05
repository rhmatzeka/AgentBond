import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { WalletConnectButton } from "@/components/wallet-connect-button";

const navLinks = [
  { href: "/#check", label: "Check a seller" },
  { href: "/reports", label: "Reports" },
  { href: "/demo", label: "Sellers" },
  { href: "/#api", label: "API" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-rule/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link className="flex items-center gap-2.5 text-ink" href="/">
          <BrandMark />
          <span className="text-lg font-semibold tracking-tight">AgentBond</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 text-[15px] text-ink-soft md:flex">
          {navLinks.map((link) => (
            <Link className="transition-colors hover:text-ink" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <WalletConnectButton />
      </div>
      <nav aria-label="Main mobile" className="flex gap-5 overflow-x-auto px-5 pb-3 text-sm text-ink-soft md:hidden">
        {navLinks.map((link) => (
          <Link className="whitespace-nowrap hover:text-ink" href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
