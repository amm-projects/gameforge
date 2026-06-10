import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MusicPicker } from "./MusicPicker";

describe("MusicPicker", () => {
  it("renders all music options", () => {
    render(<MusicPicker music="calm" setMusic={vi.fn()} />);
    expect(screen.getByText("Calm")).toBeDefined();
    expect(screen.getByText("Adventure")).toBeDefined();
    expect(screen.getByText("Retro")).toBeDefined();
    expect(screen.getByText("Mystery")).toBeDefined();
    expect(screen.getByText("Boss")).toBeDefined();
  });

  it("calls setMusic on click", async () => {
    const setMusic = vi.fn();
    render(<MusicPicker music="calm" setMusic={setMusic} />);
    await userEvent.click(screen.getByRole("button", { name: /set music to adventure/i }));
    expect(setMusic).toHaveBeenCalledWith("adventure");
  });

  it("highlights selected music", () => {
    render(<MusicPicker music="adventure" setMusic={vi.fn()} />);
    const adventureBtn = screen.getByRole("button", { name: /set music to adventure/i });
    expect(adventureBtn.className).toContain("amber");
  });

  it("does not highlight non-selected music", () => {
    render(<MusicPicker music="calm" setMusic={vi.fn()} />);
    const adventureBtn = screen.getByRole("button", { name: /set music to adventure/i });
    expect(adventureBtn.className).not.toContain("amber");
  });
});
