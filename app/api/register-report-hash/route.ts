export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({
    mode: "client-wallet-required",
    message:
      "Register report hashes from the connected wallet in the browser so the requester address is preserved.",
    reportHash: body.reportHash,
  });
}
