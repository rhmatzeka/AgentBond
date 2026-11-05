import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { WalletConnectButton } from "@/components/wallet-connect-button";

const navLinks = [
  { href: "/#check", label: "Check a seller" },
  { href: "/reports", label: "Reports" },
  { href: "/demo", label: "Sellers" },
  { href: "/#api", label: "API" },
];

const linkClass = "rounded-full px-4 py-2 transition-colors hover:bg-ink hover:text-paper";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="flex h-16 items-stretch justify-between sm:h-20">
        <Link className="flex items-center gap-3 px-5 sm:px-8" href="/">
          <BrandMark />
          <span className="text-[1.75rem] font-black tracking-[-0.04em]">agentbond</span>
        </Link>

        <div className="flex items-stretch">
          <nav aria-label="Main" className="hidden items-center gap-1 px-4 text-lg lg:flex">
            {navLinks.map((link) => (
              <Link className={linkClass} href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <WalletConnectButton />
        </div>
      </div>
      <nav
        aria-label="Main mobile"
        className="flex gap-1 overflow-x-auto border-t border-line px-3 py-2 [scrollbar-width:none] lg:hidden"
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
