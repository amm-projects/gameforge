import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LayerBar } from './LayerBar';

const visibleLayers = new Set([0, 1, 2, 3, 4, 5]);

describe('LayerBar', () => {
  it('renders 6 layer buttons', () => {
    render(
      <LayerBar
        activeLayer={2}
        visibleLayers={visibleLayers}
        setActiveLayer={() => {}}
        toggleLayerVisibility={() => {}}
      />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(6);
  });

  it('calls toggleLayerVisibility on click', () => {
    const toggle = vi.fn();
    render(
      <LayerBar
        activeLayer={2}
        visibleLayers={visibleLayers}
        setActiveLayer={() => {}}
        toggleLayerVisibility={toggle}
      />
    );
    fireEvent.click(screen.getByText('0'));
    expect(toggle).toHaveBeenCalledWith(0);
  });

  it('calls setActiveLayer on right click', () => {
    const setActive = vi.fn();
    render(
      <LayerBar
        activeLayer={2}
        visibleLayers={visibleLayers}
        setActiveLayer={setActive}
        toggleLayerVisibility={() => {}}
      />
    );
    fireEvent.contextMenu(screen.getByText('3'));
    expect(setActive).toHaveBeenCalledWith(3);
  });

  it('marks active layer as pressed', () => {
    render(
      <LayerBar
        activeLayer={4}
        visibleLayers={visibleLayers}
        setActiveLayer={() => {}}
        toggleLayerVisibility={() => {}}
      />
    );
    const button = screen.getByText('4');
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('shows line-through for hidden layers', () => {
    const hiddenLayers = new Set([0, 1, 3, 4, 5]);
    const { container } = render(
      <LayerBar
        activeLayer={0}
        visibleLayers={hiddenLayers}
        setActiveLayer={() => {}}
        toggleLayerVisibility={() => {}}
      />
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons[2].className).toContain('line-through');
    expect(buttons[0].className).not.toContain('line-through');
  });
});
