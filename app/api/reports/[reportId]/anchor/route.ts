import { getReportStore } from "@/lib/data/reports-store";
import { isRegistryConfigured, reportRegistryAddress } from "@/lib/web3/contract";
import { AnchorVerificationError, verifyAnchorTx } from "@/lib/web3/verify-anchor";

const TX_HASH = /^0x[0-9a-fA-F]{64}$/;

/**
 * Called by the browser after the buyer's wallet registers the hash. The server
 * checks the tx on Base Sepolia itself before saving it on the report.
 */
export async function POST(request: Request, context: { params: Promise<{ reportId: string }> }) {
  if (!isRegistryConfigured) {
    return Response.json({ error: "The report registry contract is not configured" }, { status: 503 });
  }
  const { reportId } = await context.params;
  const body = await request.json().catch(() => null);
  const txHash = body?.txHash;
  if (typeof txHash !== "string" || !TX_HASH.test(txHash)) {
    return Response.json({ error: "txHash must be a 0x-prefixed 32-byte hash" }, { status: 400 });
  }

  const store = getReportStore();
  const report = await store.get(reportId);
  if (!report) return Response.json({ error: "Report not found" }, { status: 404 });
  if (report.anchor) return Response.json({ report });

  try {
    const anchor = await verifyAnchorTx({
      txHash: txHash as `0x${string}`,
      reportHash: report.reportHash,
      registryAddress: reportRegistryAddress,
    });
    return Response.json({ report: await store.setAnchor(reportId, anchor) });
  } catch (error) {
    if (error instanceof AnchorVerificationError) {
      return Response.json({ error: error.message }, { status: 422 });
    }
    console.error("Anchor verification failed", error);
    return Response.json({ error: "Failed to verify the anchor transaction" }, { status: 500 });
  }
}
