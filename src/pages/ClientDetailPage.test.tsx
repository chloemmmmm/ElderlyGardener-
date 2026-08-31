import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { ClientDetailPage } from "./ClientDetailPage";

describe("ClientDetailPage", () => {
  it("renders overview actions inside a valid tabs context", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/clients/client-001"]}>
          <Routes>
            <Route path="/clients/:clientId" element={<ClientDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByRole("heading", { name: "王桂兰", level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "查看全部 →" }),
    ).toBeInTheDocument();
  });
});
