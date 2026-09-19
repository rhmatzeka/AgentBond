import Link from "next/link";
import { WalletConnectButton } from "@/components/wallet-connect-button";

const navLinks = [
  { href: "/#playground", label: "Playground" },
  { href: "/demo", label: "Demo agents" },
  { href: "https://github.com/rhmatzeka/AgentBond#api", label: "API" },
  { href: "https://github.com/rhmatzeka/AgentBond", label: "GitHub" },
];

export function SiteHeader() {
  return (
    <header className="flex w-full items-center justify-between py-5">
      <Link className="flex items-center gap-3" href="/">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green font-mono text-sm font-semibold text-black shadow-[0_0_15px_rgba(0,212,164,0.3)]">
          AB
        </div>
        <span className="text-lg font-semibold tracking-tight text-white">AgentBond</span>
      </Link>

      <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-400 md:flex">
        {navLinks.map((link) =>
          link.href.startsWith("http") ? (
            <a className="transition hover:text-white" href={link.href} key={link.href} rel="noreferrer" target="_blank">
              {link.label}
            </a>
          ) : (
            <Link className="transition hover:text-white" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ),
        )}
      </nav>

      <WalletConnectButton />
    </header>
  );
}
