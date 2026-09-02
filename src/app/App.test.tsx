import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";

import { App } from "./App";

describe("App", () => {
  it(
    "renders the project showcase homepage on root route",
    async () => {
      render(<App />);

      await waitFor(() => expect(document.body.textContent).toContain("康护园"), {
        timeout: 20_000,
      });
      expect(
        screen.getByRole("heading", { level: 1, name: /康护园/ }),
      ).toBeVisible();
      expect(screen.getByRole("link", { name: "进入 B 端后台" })).toBeVisible();
      expect(screen.getByRole("link", { name: "产品 PRD" })).toBeVisible();
    },
    45_000,
  );

  it("navigates to the B-side dashboard and has no detectable accessibility violations", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(await screen.findByRole("link", { name: "进入 B 端后台" }));
    await screen.findByRole("heading", { name: "早上好，林医生" }, { timeout: 5_000 });

    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
