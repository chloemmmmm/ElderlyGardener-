import { describe, expect, it } from "vitest";
import { rehabilitationApi } from "./rehabilitation";

describe("rehabilitationApi", () => {
  it("returns server-filtered and paginated clients", async () => {
    const result = await rehabilitationApi.getClients({
      q: "王",
      stage: "all",
      alert: "all",
      plan: "all",
      sort: "attention",
      page: 1,
      pageSize: 10,
    });

    expect(result.items.map((client) => client.name)).toEqual(["王桂兰"]);
    expect(result.total).toBe(1);
  });

  it("surfaces save failure without discarding the requested plan data", async () => {
    await expect(
      rehabilitationApi.updatePlan(
        "plan-001",
        { exercises: [] },
        { scenario: "save-error" },
      ),
    ).rejects.toMatchObject({
      status: 503,
      message: "计划未保存，请稍后重试。",
    });
  });
});
