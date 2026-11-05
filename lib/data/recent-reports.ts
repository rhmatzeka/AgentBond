import { getReportStore } from "@/lib/data/reports-store";

/** Recent reports for server pages. A database hiccup shows an empty list instead of a 500. */
export async function loadRecentReports(limit: number) {
  try {
    return await getReportStore().list(limit);
  } catch (error) {
    console.error("Could not load recent reports", error);
    return [];
  }
}

/** Total checks run, or null when the store cannot be reached. */
export async function loadReportCount() {
  try {
    return await getReportStore().count();
  } catch (error) {
    console.error("Could not count reports", error);
    return null;
  }
}
