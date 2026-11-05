import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-5 py-24 text-center sm:px-8">
      <h1 className="text-4xl font-black tracking-[-0.04em]">Nothing on file</h1>
      <p className="mt-3 text-graphite">
        This page or report does not exist. Report links only work for checks saved by this server.
      </p>
      <Link className="mt-8 nb-btn bg-ink text-card" href="/#check">
        Run a new check
      </Link>
    </main>
  );
}
