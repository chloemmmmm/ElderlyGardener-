import { describe, expect, it } from "vitest";

import { getPublicAssetUrl, getRouterBasename } from "./public-path";

describe("public path helpers", () => {
  it("keeps root deployments at the domain root", () => {
    expect(getRouterBasename("/")).toBe("/");
    expect(getPublicAssetUrl("/", "mockServiceWorker.js")).toBe(
      "/mockServiceWorker.js",
    );
  });

  it("keeps GitHub Pages routes and public assets under the repository path", () => {
    expect(getRouterBasename("/kanghuyuan-demo/")).toBe(
      "/kanghuyuan-demo",
    );
    expect(
      getPublicAssetUrl("/kanghuyuan-demo/", "/mockServiceWorker.js"),
    ).toBe("/kanghuyuan-demo/mockServiceWorker.js");
  });
});
