import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-5 py-24 text-center sm:px-8">
      <h1 className="text-4xl font-bold tracking-tight [font-stretch:85%]">Nothing on file</h1>
      <p className="mt-3 text-ink-soft">
        This page or report does not exist. Report links only work for checks saved by this server.
      </p>
      <Link
        className="mt-8 inline-block rounded-md bg-pen px-5 py-2.5 font-semibold text-sheet hover:bg-pen-deep"
        href="/#check"
      >
        Run a new check
      </Link>
    </main>
  );
}
