import Link from "next/link";
import { explorerAddressUrl, isRegistryConfigured, reportRegistryAddress } from "@/lib/web3/contract";

const linkClass = "hover:underline underline-offset-4";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-card">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:py-20">
        <div>
          <p className="display max-w-lg text-4xl sm:text-5xl">Check the seller before your agent pays.</p>
          <Link className="nb-btn mt-8 bg-lilac text-ink hover:shadow-[4px_4px_0_0_#fff]" href="/#check">
            Run a free check
          </Link>
        </div>
        <div className="grid grid-cols-2 content-start gap-x-8 gap-y-3 text-[17px]">
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
      <div className="mx-auto max-w-7xl border-t border-card/25 px-5 py-6 text-sm text-card/60 sm:px-8">
        AgentBond gives a recommendation, not a guarantee. The four demo sellers and their records are synthetic.
      </div>
    </footer>
  );
}
