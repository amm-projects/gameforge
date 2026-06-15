import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EntityProperties } from "./EntityProperties";
import type { Entity } from "@/types/level";

describe("EntityProperties", () => {
  it('shows "No properties" when entity has no properties', () => {
    const entity: Entity = { id: "e1", type: "coin", position: { x: 0, y: 0 }, properties: {} };
    render(<EntityProperties entity={entity} updateEntityProperty={vi.fn()} />);
    expect(screen.getByText("No properties")).toBeDefined();
  });

  it("renders existing properties", () => {
    const entity: Entity = { id: "e1", type: "walker", position: { x: 0, y: 0 }, properties: { speed: "80", behavior: "patrol" } };
    render(<EntityProperties entity={entity} updateEntityProperty={vi.fn()} />);
    expect(screen.getByDisplayValue("80")).toBeDefined();
    expect(screen.getByDisplayValue("patrol")).toBeDefined();
  });

  it("calls updateEntityProperty when property value changes", async () => {
    const updateEntityProperty = vi.fn();
    const entity: Entity = { id: "e1", type: "coin", position: { x: 0, y: 0 }, properties: { value: "10" } };
    render(<EntityProperties entity={entity} updateEntityProperty={updateEntityProperty} />);
    const input = screen.getByDisplayValue("10");
    fireEvent.change(input, { target: { value: "50" } });
    expect(updateEntityProperty).toHaveBeenLastCalledWith("e1", "value", "50");
  });

  it("adds a new property via + button", async () => {
    const updateEntityProperty = vi.fn();
    const entity: Entity = { id: "e1", type: "coin", position: { x: 0, y: 0 }, properties: {} };
    render(<EntityProperties entity={entity} updateEntityProperty={updateEntityProperty} />);
    const keyInput = screen.getByLabelText(/new property key/i);
    const valueInput = screen.getByLabelText(/new property value/i);
    await userEvent.type(keyInput, "color");
    await userEvent.type(valueInput, "gold");
    await userEvent.click(screen.getByRole("button", { name: /add property/i }));
    expect(updateEntityProperty).toHaveBeenCalledWith("e1", "color", "gold");
  });

  it("does not add property with empty key", async () => {
    const updateEntityProperty = vi.fn();
    const entity: Entity = { id: "e1", type: "coin", position: { x: 0, y: 0 }, properties: {} };
    render(<EntityProperties entity={entity} updateEntityProperty={updateEntityProperty} />);
    await userEvent.click(screen.getByRole("button", { name: /add property/i }));
    expect(updateEntityProperty).not.toHaveBeenCalled();
  });

  it("displays entity type in header", () => {
    const entity: Entity = { id: "e1", type: "coin", position: { x: 0, y: 0 }, properties: {} };
    render(<EntityProperties entity={entity} updateEntityProperty={vi.fn()} />);
    expect(screen.getByText("coin Properties")).toBeDefined();
  });
});
