import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GridCell } from './GridCell';

describe('GridCell', () => {
  it('renders with tile type', () => {
    render(<GridCell x={0} y={0} tileType="ground" isSelected={false} isEditTarget={false} />);
    const cell = screen.getByRole('button');
    expect(cell).toBeDefined();
    expect(cell.getAttribute('aria-label')).toContain('ground');
  });

  it('renders with entity type', () => {
    render(<GridCell x={5} y={10} entityType="player" isSelected={false} isEditTarget={false} />);
    const cell = screen.getByRole('button');
    expect(cell.getAttribute('aria-label')).toContain('player');
  });

  it('shows selected border when isSelected', () => {
    const { container } = render(<GridCell x={0} y={0} entityType="coin" isSelected={true} isEditTarget={false} />);
    const cell = container.firstChild as HTMLElement;
    expect(cell.className).toContain('cyan');
  });

  it('shows edit target border when isEditTarget', () => {
    const { container } = render(<GridCell x={0} y={0} tileType="ground" isSelected={false} isEditTarget={true} />);
    const cell = container.firstChild as HTMLElement;
    expect(cell.className).toContain('amber');
  });

  it('sets data-x and data-y attributes', () => {
    render(<GridCell x={3} y={7} entityType="enemy" isSelected={false} isEditTarget={false} />);
    const cell = screen.getByRole('button');
    expect(cell.getAttribute('data-x')).toBe('3');
    expect(cell.getAttribute('data-y')).toBe('7');
  });

  it('renders empty cell without tile or entity', () => {
    const { container } = render(<GridCell x={0} y={0} isSelected={false} isEditTarget={false} />);
    const cell = container.firstChild as HTMLElement;
    expect(cell.className).toContain('slate');
  });
});
