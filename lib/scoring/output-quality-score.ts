/**
 * Text-only quality heuristic. Used on its own when no LLM is configured and
 * blended with the LLM verdict otherwise, so a prompt-injected output cannot
 * talk its way to a perfect score.
 */

export type QualityAnalysis = {
  score: number;
  flags: string[];
  notes: string[];
};

const STOPWORDS = new Set([
  "about",
  "above",
  "after",
  "also",
  "find",
  "from",
  "give",
  "have",
  "into",
  "list",
  "make",
  "more",
  "please",
  "should",
  "that",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "what",
  "when",
  "which",
  "with",
  "write",
  "your",
]);

const DISMISSES_EVIDENCE = /\bno (sources?|citations?|references?) (needed|required|necessary)\b|\btrust me\b/i;
const NO_DELIVERY =
  /\b(i can|i could|i will|i'?ll) (summari[sz]e|research|review|extract|write|help|do)\b|\bi do not have\b|\bi don'?t have\b|\bas an ai\b/i;
const URL = /https?:\/\/\S+/gi;
const NUMBER = /\b\d+(?:[.,]\d+)?\s?(?:%|percent|[kmb]\b|x\b)?/gi;
const NAMED_SOURCES = /\b(?:sources?|references?|citations?)\s*:\s*([^\n.]+)/i;

const words = (text: string) => text.toLowerCase().match(/[a-z0-9]+/g) ?? [];

function keywords(text: string) {
  return [...new Set(words(text).filter((word) => word.length > 3 && !STOPWORDS.has(word)))];
}

/** Share of the task's keywords the output talks about (4-letter stem match). */
function relevance(output: string, task: string) {
  const wanted = keywords(task);
  if (wanted.length === 0) return 1;
  const stems = new Set(words(output).map((word) => word.slice(0, 4)));
  return wanted.filter((word) => stems.has(word.slice(0, 4))).length / wanted.length;
}

function evidencePoints(output: string) {
  if (DISMISSES_EVIDENCE.test(output)) return 0;
  const named =
    output
      .match(NAMED_SOURCES)?.[1]
      .split(/,|;|\band\b/)
      .filter((item) => item.trim()).length ?? 0;
  const links = output.match(URL)?.length ?? 0;
  const numbers = output.replace(URL, "").match(NUMBER)?.length ?? 0;
  return Math.min(35, named * 7 + links * 10 + Math.min(numbers, 3) * 4);
}

export function analyzeOutputQuality(output: string, task: string): QualityAnalysis {
  const text = output.trim();
  const wordCount = words(text).length;
  const flags: string[] = [];

  const substance = Math.min(wordCount / 40, 1) * 30;
  const evidence = evidencePoints(text);
  const onTopic = relevance(text, task) * 25;
  const structure = /[.;:]\s+\S/.test(text) && wordCount >= 15 ? 10 : 0;

  let score = substance + evidence + onTopic + structure;

  if (DISMISSES_EVIDENCE.test(text)) {
    flags.push("dismisses_evidence");
    score -= 25;
  }
  if (NO_DELIVERY.test(text)) {
    flags.push("no_delivery");
    score -= 25;
  }
  if (wordCount < 12) flags.push("too_short");

  const final = Math.max(0, Math.min(100, Math.round(score)));
  return { score: final, flags, notes: [describe(final, flags)] };
}

function describe(score: number, flags: string[]) {
  if (flags.includes("no_delivery")) return "The sample describes what the seller could do instead of doing it.";
  if (flags.includes("dismisses_evidence"))
    return "The sample brushes off sources, a common sign of low-effort output.";
  if (score >= 75) return "Output is on topic, specific, and backs its claims with sources.";
  if (score >= 35) return "Output is relevant but thin on sources or concrete detail.";
  return "Output is short, generic, or off topic for the task.";
}
