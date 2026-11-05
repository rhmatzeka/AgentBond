import { isRegistryConfigured, explorerAddressUrl, reportRegistryAddress } from "@/lib/web3/contract";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>AgentBond gives a recommendation, not a guarantee. Demo seller data is synthetic.</p>
        <div className="flex gap-5">
          {isRegistryConfigured && (
            <a
              className="hover:text-ink"
              href={explorerAddressUrl(reportRegistryAddress)}
              rel="noreferrer"
              target="_blank"
            >
              Registry contract
            </a>
          )}
          <a className="hover:text-ink" href="https://github.com/rhmatzeka/AgentBond" rel="noreferrer" target="_blank">
            Source on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
