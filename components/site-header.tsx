import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { MobileMenu } from "@/components/mobile-menu";
import { WalletConnectButton } from "@/components/wallet-connect-button";

export const navLinks = [
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
        <Link className="flex min-w-0 items-center gap-2.5 pl-4 pr-3 sm:gap-3 sm:px-8" href="/">
          <BrandMark className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
          <span className="text-2xl font-black tracking-[-0.04em] sm:text-[1.75rem]">agentbond</span>
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
          <MobileMenu links={navLinks} />
        </div>
      </div>
    </header>
  );
}
