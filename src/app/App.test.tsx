import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";

import { App } from "./App";

describe("App", () => {
  it("renders the concept label and primary navigation", async () => {
    render(<App />);

    expect(await screen.findByText("概念演示")).toBeVisible();
    expect(screen.getByRole("link", { name: "工作台" })).toBeVisible();
    expect(screen.getByRole("link", { name: "康复对象" })).toBeVisible();
  });

  it("has no detectable accessibility violations on the dashboard", async () => {
    const { container } = render(<App />);
    await screen.findByRole(
      "heading",
      { name: "早上好，林医生" },
      { timeout: 5_000 },
    );

    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
