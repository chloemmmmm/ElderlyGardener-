import { describe, expect, it } from "vitest";

import { isDemoModeEnabled } from "./demo-mode";

describe("isDemoModeEnabled", () => {
  it("keeps browser demo data enabled in a production build by default", () => {
    expect(isDemoModeEnabled(undefined)).toBe(true);
  });

  it("allows a future real backend to disable browser demo data explicitly", () => {
    expect(isDemoModeEnabled("false")).toBe(false);
  });
});
