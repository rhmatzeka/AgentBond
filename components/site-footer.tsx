import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { explorerAddressUrl, isRegistryConfigured, reportRegistryAddress } from "@/lib/web3/contract";

const linkClass = "font-semibold underline decoration-2 underline-offset-4 hover:no-underline";

export function SiteFooter() {
  return (
    <footer className="border-t-[3px] border-ink bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <Link className="flex items-center gap-2.5" href="/">
            <BrandMark className="h-9 w-9" />
            <span className="display text-3xl">AgentBond</span>
          </Link>
          <p className="mt-3 max-w-md text-sm text-graphite">
            A recommendation, not a guarantee. The four demo sellers and their track records are synthetic.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link className={linkClass} href="/reports">
            Reports
          </Link>
          <Link className={linkClass} href="/#api">
            API
          </Link>
          {isRegistryConfigured && (
            <a className={linkClass} href={explorerAddressUrl(reportRegistryAddress)} rel="noreferrer" target="_blank">
              Registry contract
            </a>
          )}
          <a className={linkClass} href="https://github.com/rhmatzeka/AgentBond" rel="noreferrer" target="_blank">
            Source on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
