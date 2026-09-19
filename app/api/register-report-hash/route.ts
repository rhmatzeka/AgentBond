// Registration is intentionally client-side: the buyer's wallet signs the tx so the
// on-chain `requester` is the buyer, not a server key. This endpoint only documents that.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return Response.json({
    mode: "client-wallet-required",
    message:
      "Register report hashes from the connected wallet in the browser so the requester address is preserved.",
    reportHash: typeof body?.reportHash === "string" ? body.reportHash : null,
  });
}
