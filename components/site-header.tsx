import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { WalletConnectButton } from "@/components/wallet-connect-button";

const navLinks = [
  { href: "/#check", label: "Check a seller" },
  { href: "/reports", label: "Reports" },
  { href: "/demo", label: "Sellers" },
  { href: "/#api", label: "API" },
];

const linkClass = "decoration-2 underline-offset-[6px] hover:underline";

export function SiteHeader() {
  return (
    <header className="border-b-2 border-ink bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
        <Link className="flex items-center gap-2.5" href="/">
          <BrandMark />
          <span className="text-lg font-extrabold tracking-tight">AgentBond</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 text-[15px] font-semibold md:flex">
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
        className="flex gap-5 overflow-x-auto border-t-2 border-ink px-5 py-2.5 text-sm font-semibold md:hidden"
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
