import { describe, expect, it, vi } from "vitest";
import { createQualityJudge } from "@/lib/llm/quality-judge";

const config = { apiKey: "test-key", baseUrl: "https://llm.example/v1", model: "test-model" };
const input = { taskType: "research" as const, task: "Find sources about Base", output: "Base grew. Sources: L2Beat." };

function completion(content: string, status = 200) {
  return new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status });
}

describe("quality judge", () => {
  it("returns the parsed verdict and sends the output as delimited data", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        completion(JSON.stringify({ score: 81, flags: ["thin_sources"], summary: "Relevant, light on sources." })),
      );
    const judge = createQualityJudge(config, fetchMock);

    const verdict = await judge(input);

    expect(verdict).toEqual({
      score: 81,
      flags: ["thin_sources"],
      summary: "Relevant, light on sources.",
      model: "test-model",
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://llm.example/v1/chat/completions");
    expect(init.headers.Authorization).toBe("Bearer test-key");
    expect(init.body).toContain("<seller_output>");
  });

  it("clamps scores and drops malformed flags", async () => {
    const judge = createQualityJudge(
      config,
      vi
        .fn()
        .mockResolvedValue(
          completion('{"score": 140, "flags": [1, "ok_flag", "Missing-Sources", "<script>"], "summary": "x"}'),
        ),
    );
    const verdict = await judge(input);
    expect(verdict?.score).toBe(100);
    expect(verdict?.flags).toEqual(["ok_flag", "missing_sources"]);
  });

  it("returns null on HTTP errors, bad JSON, or network failures", async () => {
    expect(await createQualityJudge(config, vi.fn().mockResolvedValue(completion("{}", 500)))(input)).toBeNull();
    expect(await createQualityJudge(config, vi.fn().mockResolvedValue(completion("not json")))(input)).toBeNull();
    expect(await createQualityJudge(config, vi.fn().mockRejectedValue(new Error("offline")))(input)).toBeNull();
  });

  it("caches identical requests", async () => {
    const fetchMock = vi.fn().mockResolvedValue(completion('{"score": 50, "flags": [], "summary": "ok"}'));
    const judge = createQualityJudge(config, fetchMock);
    await judge(input);
    await judge(input);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
