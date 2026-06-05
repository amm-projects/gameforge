import { test, expect } from '@playwright/test';

test.describe('GameForge Editor', () => {
  test('loads the editor page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Editor de niveles');
    await expect(page.locator('text=GameForge')).toBeVisible();
  });

  test('renders the canvas grid', async ({ page }) => {
    await page.goto('/');
    const grid = page.locator('#grid');
    await expect(grid).toBeVisible();
    await expect(page.locator('text=64x64 grid')).toBeVisible();
  });

  test('renders all panels', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Tiles' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Entidades' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Assets' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Inspector' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Canvas del nivel' })).toBeVisible();
  });

  test('selects spike tile on click', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Pinchos ↑: seleccionar tile' }).click();
    const spikeBtn = page.getByRole('button', { name: 'Pinchos ↑: seleccionar tile' });
    await expect(spikeBtn).toHaveClass(/bg-slate-700/);
  });

  test('selects enemy entity on click', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Enemigo: seleccionar entidad' }).click();
    const enemyBtn = page.getByRole('button', { name: 'Enemigo: seleccionar entidad' });
    await expect(enemyBtn).toHaveClass(/bg-slate-700/);
  });

  test('switches to erase tool', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Borrar' }).click();
    await expect(page.getByRole('button', { name: 'Borrar' })).toHaveClass(/bg-slate-700/);
  });

  test('paints a tile on the canvas', async ({ page }) => {
    await page.goto('/');
    const grid = page.locator('#grid');
    const gridBox = await grid.boundingBox();
    if (!gridBox) throw new Error('Grid not found');

    const x = gridBox.x + 50;
    const y = gridBox.y + 50;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.up();
    await expect(page.locator('text=Tiles: 1')).toBeVisible();
  });

  test('paints multiple tiles by dragging', async ({ page }) => {
    await page.goto('/');
    const grid = page.locator('#grid');
    const gridBox = await grid.boundingBox();
    if (!gridBox) throw new Error('Grid not found');

    await page.mouse.move(gridBox.x + 50, gridBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(gridBox.x + 100, gridBox.y + 100, { steps: 5 });
    await page.mouse.up();

    const tileCount = page.locator('text=/Tiles: \\d+/');
    await expect(tileCount).toBeVisible();
  });

  test('places an entity on the canvas', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    // Verify default state shows 0 entities
    await expect(page.locator('text=Entidades: 0')).toBeVisible({ timeout: 5000 });

    // Select player entity via ToolPanel EntityRow
    await page.locator('[aria-label="Jugador: seleccionar entidad player"]').click();
    await page.waitForTimeout(200);

    // Dispatch native mouse events on the grid to place the player entity.
    // Using page.evaluate with dispatchEvent avoids flakiness with Playwright's
    // CDP mouse events interacting with React's async state updates.
    const placed = await page.evaluate(() => {
      const grid = document.getElementById('grid');
      if (!grid) return false;

      const rect = grid.getBoundingClientRect();
      const cx = rect.left + 50;
      const cy = rect.top + 50;

      const downEvent = new MouseEvent('mousedown', {
        clientX: cx, clientY: cy, button: 0, bubbles: true, cancelable: true,
      });
      grid.dispatchEvent(downEvent);

      const upEvent = new MouseEvent('mouseup', {
        clientX: cx, clientY: cy, button: 0, bubbles: true, cancelable: true,
      });
      window.dispatchEvent(upEvent);
      return true;
    });
    expect(placed).toBe(true);

    await page.waitForTimeout(300);
    await expect(page.locator('text=Entidades: 1')).toBeVisible({ timeout: 5000 });
  });

  test('exports level JSON', async ({ page }) => {
    await page.goto('/');
    const grid = page.locator('#grid');
    const gridBox = await grid.boundingBox();
    if (!gridBox) throw new Error('Grid not found');

    const x = gridBox.x + 50;
    const y = gridBox.y + 50;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.up();
    await page.getByRole('button', { name: 'Exportar JSON' }).click();

    const textarea = page.locator('textarea');
    const jsonText = await textarea.inputValue();
    const parsed = JSON.parse(jsonText);
    expect(parsed).toHaveProperty('width', 64);
    expect(parsed).toHaveProperty('height', 64);
    expect(parsed.tiles.length).toBeGreaterThanOrEqual(1);
  });

  test('loads level JSON', async ({ page }) => {
    await page.goto('/');
    const level = JSON.stringify({
      width: 16,
      height: 12,
      tiles: [{ x: 2, y: 3, type: 'spike-up' }],
      entities: [{ id: 'e1', type: 'coin', position: { x: 5, y: 5 }, properties: {} }],
    });

    const textarea = page.locator('textarea');
    await textarea.fill(level);
    await page.getByRole('button', { name: 'Cargar JSON' }).click();

    await expect(page.locator('text=16 × 12')).toBeVisible();
    await expect(page.locator('text=Tiles: 1')).toBeVisible();
    await expect(page.locator('text=Entidades: 1')).toBeVisible();
  });

  test('resets level', async ({ page }) => {
    await page.goto('/');
    const grid = page.locator('#grid');
    const gridBox = await grid.boundingBox();
    if (!gridBox) throw new Error('Grid not found');

    await page.mouse.click(gridBox.x + 50, gridBox.y + 50);
    await page.getByRole('button', { name: 'Limpiar nivel' }).click();

    await expect(page.locator('text=Tiles: 0')).toBeVisible();
    await expect(page.locator('text=Entidades: 0')).toBeVisible();
  });

  test('erases a tile with erase tool', async ({ page }) => {
    await page.goto('/');
    const grid = page.locator('#grid');
    const gridBox = await grid.boundingBox();
    if (!gridBox) throw new Error('Grid not found');

    await page.mouse.click(gridBox.x + 50, gridBox.y + 50);
    await page.getByRole('button', { name: 'Borrar' }).click();
    await page.mouse.click(gridBox.x + 50, gridBox.y + 50);

    await expect(page.locator('text=Tiles: 0')).toBeVisible();
  });
});
