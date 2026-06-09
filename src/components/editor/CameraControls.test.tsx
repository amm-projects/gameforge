import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CameraControls } from "./CameraControls";

describe("CameraControls", () => {
  it("renders zoom percentage", () => {
    render(<CameraControls zoom={1} zoomIn={vi.fn()} zoomOut={vi.fn()} resetZoom={vi.fn()} />);
    expect(screen.getByText("100%")).toBeDefined();
  });

  it("renders zoom percentage at 50%", () => {
    render(<CameraControls zoom={0.5} zoomIn={vi.fn()} zoomOut={vi.fn()} resetZoom={vi.fn()} />);
    expect(screen.getByText("50%")).toBeDefined();
  });

  it("calls zoomIn on + button click", async () => {
    const zoomIn = vi.fn();
    render(<CameraControls zoom={1} zoomIn={zoomIn} zoomOut={vi.fn()} resetZoom={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /zoom in/i }));
    expect(zoomIn).toHaveBeenCalledOnce();
  });

  it("calls zoomOut on - button click", async () => {
    const zoomOut = vi.fn();
    render(<CameraControls zoom={1} zoomIn={vi.fn()} zoomOut={zoomOut} resetZoom={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /zoom out/i }));
    expect(zoomOut).toHaveBeenCalledOnce();
  });

  it("calls resetZoom on ⊞ button click", async () => {
    const resetZoom = vi.fn();
    render(<CameraControls zoom={1} zoomIn={vi.fn()} zoomOut={vi.fn()} resetZoom={resetZoom} />);
    await userEvent.click(screen.getByRole("button", { name: /reset zoom/i }));
    expect(resetZoom).toHaveBeenCalledOnce();
  });
});
