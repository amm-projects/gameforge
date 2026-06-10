import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditTargetInspector } from "./EditTargetInspector";
import type { EditTarget } from "@/stores/selectionStore";

describe("EditTargetInspector", () => {
  const baseProps = {
    tiles: [] as { x: number; y: number; type: string; solid?: boolean; properties?: Record<string, unknown> }[],
    updateTileSolid: vi.fn(),
    updateTileProperty: vi.fn(),
    setSelectedEditTarget: vi.fn(),
  };

  it("shows tile kind header for tile target", () => {
    const target: EditTarget = { kind: "tile", type: "ground", x: 3, y: 5 };
    render(<EditTargetInspector editTarget={target} {...baseProps} />);
    expect(screen.getByText("Tile")).toBeDefined();
  });

  it("shows entity kind header for entity target", () => {
    const target: EditTarget = { kind: "entity", type: "player", x: 1, y: 1 };
    render(<EditTargetInspector editTarget={target} {...baseProps} />);
    expect(screen.getByText("Entity")).toBeDefined();
  });

  it("displays tile name from definition", () => {
    const target: EditTarget = { kind: "tile", type: "ground", x: 0, y: 0 };
    render(<EditTargetInspector editTarget={target} {...baseProps} />);
    expect(screen.getByText("Ground")).toBeDefined();
  });

  it("displays tile position", () => {
    const target: EditTarget = { kind: "tile", type: "ground", x: 3, y: 5 };
    render(<EditTargetInspector editTarget={target} {...baseProps} />);
    expect(screen.getByText("(3, 5)")).toBeDefined();
  });

  it("displays entity name", () => {
    const target: EditTarget = { kind: "entity", type: "player", x: 1, y: 1 };
    render(<EditTargetInspector editTarget={target} {...baseProps} />);
    expect(screen.getByText("Player")).toBeDefined();
  });

  it("displays entity position", () => {
    const target: EditTarget = { kind: "entity", type: "coin", x: 2, y: 4 };
    render(<EditTargetInspector editTarget={target} {...baseProps} />);
    expect(screen.getByText("(2, 4)")).toBeDefined();
  });

  it("calls updateTileSolid on collision toggle", async () => {
    const updateTileSolid = vi.fn();
    const target: EditTarget = { kind: "tile", type: "ground", x: 0, y: 0 };
    render(<EditTargetInspector editTarget={target} tiles={[]} updateTileSolid={updateTileSolid} updateTileProperty={vi.fn()} setSelectedEditTarget={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /toggle collision/i }));
    expect(updateTileSolid).toHaveBeenCalledWith(0, 0, false);
  });

  it("shows movement section for platform tiles", () => {
    const target: EditTarget = { kind: "tile", type: "platform", x: 0, y: 0 };
    render(<EditTargetInspector editTarget={target} {...baseProps} />);
    expect(screen.getByText("Movement")).toBeDefined();
  });

  it("does not show movement section for non-platform tiles", () => {
    const target: EditTarget = { kind: "tile", type: "ground", x: 0, y: 0 };
    render(<EditTargetInspector editTarget={target} {...baseProps} />);
    expect(screen.queryByText("Movement")).toBeNull();
  });

  it("shows speed and range inputs when movement direction is set", () => {
    const target: EditTarget = { kind: "tile", type: "platform", x: 0, y: 0 };
    const tiles = [{ x: 0, y: 0, type: "platform", solid: true, properties: { moveAxis: "vertical", moveSpeed: 100, moveRange: 96 } }];
    render(<EditTargetInspector editTarget={target} {...baseProps} tiles={tiles} />);
    expect(screen.getByLabelText(/movement speed/i)).toBeDefined();
    expect(screen.getByLabelText(/movement range/i)).toBeDefined();
  });

  it("close button calls setSelectedEditTarget(null)", async () => {
    const setSelectedEditTarget = vi.fn();
    const target: EditTarget = { kind: "entity", type: "player", x: 0, y: 0 };
    render(<EditTargetInspector editTarget={target} tiles={[]} updateTileSolid={vi.fn()} updateTileProperty={vi.fn()} setSelectedEditTarget={setSelectedEditTarget} />);
    await userEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(setSelectedEditTarget).toHaveBeenCalledWith(null);
  });
});
