import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { ReportLookup } from "@/components/report-lookup";
import { explorerAddressUrl, isRegistryConfigured, reportRegistryAddress } from "@/lib/web3/contract";

const linkClass = "hover:underline underline-offset-4";

export function SiteFooter() {
  return (
    <footer className="bg-paper text-lg">
      <div className="mx-auto grid max-w-[78rem] gap-12 px-4 py-14 sm:gap-14 sm:px-6 sm:py-20 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <p className="display max-w-xl text-[2rem] leading-tight sm:text-[2.75rem]">
            Got a report ID? Open it to see the verdict and check its hash.
          </p>
          <ReportLookup button="arrow" className="mt-8 max-w-xl sm:mt-10" />
          <p className="mt-10 flex items-center gap-3 sm:mt-12">
            <BrandMark className="h-6 w-6" />
            AgentBond, open source
          </p>
        </div>
        <div className="grid grid-cols-2 content-start gap-x-8 gap-y-4">
          <Link className={linkClass} href="/#check">
            Check a seller
          </Link>
          <a className={linkClass} href="https://github.com/rhmatzeka/AgentBond" rel="noreferrer" target="_blank">
            GitHub
          </a>
          <Link className={linkClass} href="/reports">
            Reports
          </Link>
          <Link className={linkClass} href="/#api">
            API
          </Link>
          <Link className={linkClass} href="/demo">
            Sellers
          </Link>
          {isRegistryConfigured && (
            <a className={linkClass} href={explorerAddressUrl(reportRegistryAddress)} rel="noreferrer" target="_blank">
              Registry contract
            </a>
          )}
          <p className="col-span-2 mt-6 text-base text-graphite sm:mt-10">
            AgentBond gives a recommendation, not a guarantee. The four demo sellers are synthetic.
          </p>
        </div>
      </div>
    </footer>
  );
}
