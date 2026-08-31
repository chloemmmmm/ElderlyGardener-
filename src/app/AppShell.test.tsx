import { render, screen } from "@testing-library/react";
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
});
