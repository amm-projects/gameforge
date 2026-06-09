import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BackgroundPicker } from "./BackgroundPicker";

describe("BackgroundPicker", () => {
  it("renders all background options", () => {
    render(<BackgroundPicker background="dark" setBackground={vi.fn()} />);
    expect(screen.getByText("Oscuro")).toBeDefined();
    expect(screen.getByText("Cielo")).toBeDefined();
    expect(screen.getByText("Bosque")).toBeDefined();
    expect(screen.getByText("Desierto")).toBeDefined();
  });

  it("calls setBackground on click", async () => {
    const setBackground = vi.fn();
    render(<BackgroundPicker background="dark" setBackground={setBackground} />);
    await userEvent.click(screen.getByRole("button", { name: /set background to ciel/i }));
    expect(setBackground).toHaveBeenCalledWith("sky");
  });

  it("highlights selected background", () => {
    render(<BackgroundPicker background="sky" setBackground={vi.fn()} />);
    const skyBtn = screen.getByRole("button", { name: /set background to ciel/i });
    expect(skyBtn.className).toContain("amber");
  });

  it("does not highlight non-selected backgrounds", () => {
    render(<BackgroundPicker background="dark" setBackground={vi.fn()} />);
    const skyBtn = screen.getByRole("button", { name: /set background to ciel/i });
    expect(skyBtn.className).not.toContain("amber");
  });
});
