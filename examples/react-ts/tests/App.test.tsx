import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App";

describe("App Integration with @krishtz/mock-client", () => {
  it("renders mock todos generated from Zod schema", async () => {
    render(<App />);

    expect(screen.getByText(/Generating mock data from Zod schema/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    const items = screen.getAllByLabelText(/Mark as/i);
    expect(items.length).toBeGreaterThan(0);
  });

  it("allows user to add a new task and displays it in list", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    const input = screen.getByLabelText(/New todo title/i);
    const submitBtn = screen.getByLabelText(/Add task/i);

    await user.type(input, "Deploy Mock Client Library");
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Deploy Mock Client Library")).toBeInTheDocument();
    });
  });

  it("allows user to toggle a todo item", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    const firstToggle = screen.getAllByLabelText(/Mark as/i)[0];
    expect(firstToggle).toBeDefined();

    await user.click(firstToggle!);
    // State updates without crashing
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("allows user to delete a todo item", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    const initialDeleteButtons = screen.getAllByLabelText(/Delete todo/i);
    const initialCount = initialDeleteButtons.length;

    await user.click(initialDeleteButtons[0]!);

    await waitFor(() => {
      const remaining = screen.queryAllByLabelText(/Delete todo/i);
      expect(remaining.length).toBe(initialCount - 1);
    });
  });
});
