import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { explorerAddressUrl, isRegistryConfigured, reportRegistryAddress } from "@/lib/web3/contract";

const linkClass = "hover:underline underline-offset-4";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div>
          <p className="display max-w-xl text-4xl sm:text-5xl">Check the seller before your agent pays.</p>
          <Link className="nb-btn nb-btn-primary mt-9" href="/#check">
            Run a free check
          </Link>
        </div>
        <div className="grid grid-cols-2 content-start gap-x-8 gap-y-4 text-lg">
          <Link className={linkClass} href="/#check">
            Check a seller
          </Link>
          <Link className={linkClass} href="/reports">
            Reports
          </Link>
          <Link className={linkClass} href="/demo">
            Sellers
          </Link>
          <Link className={linkClass} href="/#api">
            API
          </Link>
          <a className={linkClass} href="https://github.com/rhmatzeka/AgentBond" rel="noreferrer" target="_blank">
            Source on GitHub
          </a>
          {isRegistryConfigured && (
            <a className={linkClass} href={explorerAddressUrl(reportRegistryAddress)} rel="noreferrer" target="_blank">
              Registry contract
            </a>
          )}
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 border-t border-line px-5 py-7 text-graphite sm:px-8">
        <BrandMark className="h-6 w-6" />
        AgentBond gives a recommendation, not a guarantee. Demo sellers are synthetic.
      </div>
    </footer>
  );
}
