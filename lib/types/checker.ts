export type CheckerResult = {
  checkerName: string;
  score: number;
  riskFlags: string[];
  notes: string[];
  /** How the score was produced. Only the output quality checker can use an LLM. */
  method?: "llm" | "heuristic" | "rules";
  model?: string;
};
