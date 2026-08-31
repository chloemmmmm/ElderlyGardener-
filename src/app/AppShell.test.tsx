import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders the therapist workspace and primary navigation", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AppShell />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "工作台" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("navigation", { name: "主要导航" }),
    ).toBeInTheDocument();
    expect(screen.getByText("林医生")).toBeInTheDocument();
    expect(screen.getByText("概念演示")).toBeInTheDocument();
  });

  it("opens the concept demo video and closes it with Escape", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AppShell />
      </MemoryRouter>,
    );

    expect(
      screen.queryByRole("dialog", { name: "康护园 · 概念演示" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "概念演示" }));

    expect(
      screen.getByRole("dialog", { name: "康护园 · 概念演示" }),
    ).toBeInTheDocument();
    expect(screen.getByTitle("康护园概念演示视频")).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/RYUbFY3-7dA?rel=0",
    );

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("dialog", { name: "康护园 · 概念演示" }),
    ).not.toBeInTheDocument();
  });
});
