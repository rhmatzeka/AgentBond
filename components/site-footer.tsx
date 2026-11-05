import { explorerAddressUrl, isRegistryConfigured, reportRegistryAddress } from "@/lib/web3/contract";

const linkClass = "font-semibold underline decoration-2 underline-offset-4 hover:no-underline";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-ink bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-7 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-graphite">
          AgentBond gives a recommendation, not a guarantee. Demo seller data is synthetic.
        </p>
        <div className="flex gap-5">
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
