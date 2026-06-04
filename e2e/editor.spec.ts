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

  test('renders tool panel with tiles and entities', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Tiles')).toBeVisible();
    await expect(page.locator('text=Entidades')).toBeVisible();
    await expect(page.locator('text=Suelo')).toBeVisible();
    await expect(page.locator('text=Pinchos')).toBeVisible();
    await expect(page.locator('text=Jugador')).toBeVisible();
    await expect(page.locator('text=Moneda')).toBeVisible();
    await expect(page.locator('text=Enemigo')).toBeVisible();
    await expect(page.locator('text=Meta')).toBeVisible();
  });

  test('selects spike tile on click', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=Pinchos').click();
    const spikeRow = page.locator('text=Pinchos').locator('..');
    await expect(spikeRow).toHaveClass(/bg-slate-700/);
  });

  test('selects enemy entity on click', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=Enemigo').click();
    const enemyRow = page.locator('text=Enemigo').locator('..');
    await expect(enemyRow).toHaveClass(/bg-slate-700/);
  });

  test('switches to erase tool', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=Borrar').click();
    await expect(page.locator('text=Borrar')).toHaveClass(/bg-slate-700/);
  });

  test('paints a tile on the canvas', async ({ page }) => {
    await page.goto('/');
    const grid = page.locator('#grid');
    const gridBox = await grid.boundingBox();
    if (!gridBox) throw new Error('Grid not found');

    await page.mouse.click(gridBox.x + 50, gridBox.y + 50);
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
    await page.locator('text=Jugador').click();

    const grid = page.locator('#grid');
    const gridBox = await grid.boundingBox();
    if (!gridBox) throw new Error('Grid not found');

    await page.mouse.click(gridBox.x + 150, gridBox.y + 100);
    await expect(page.locator('text=Entidades: 1')).toBeVisible();
  });

  test('exports level JSON', async ({ page }) => {
    await page.goto('/');
    const grid = page.locator('#grid');
    const gridBox = await grid.boundingBox();
    if (!gridBox) throw new Error('Grid not found');

    await page.mouse.click(gridBox.x + 50, gridBox.y + 50);
    await page.locator('text=Exportar JSON').click();

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
      tiles: [{ x: 2, y: 3, type: 'spike' }],
      entities: [{ id: 'e1', type: 'coin', x: 5, y: 5 }],
    });

    const textarea = page.locator('textarea');
    await textarea.fill(level);
    await page.locator('text=Cargar JSON').click();

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
    await page.locator('text=Limpiar nivel').click();

    await expect(page.locator('text=Tiles: 0')).toBeVisible();
    await expect(page.locator('text=Entidades: 0')).toBeVisible();
  });

  test('erases a tile with erase tool', async ({ page }) => {
    await page.goto('/');
    const grid = page.locator('#grid');
    const gridBox = await grid.boundingBox();
    if (!gridBox) throw new Error('Grid not found');

    await page.mouse.click(gridBox.x + 50, gridBox.y + 50);
    await page.locator('text=Borrar').click();
    await page.mouse.click(gridBox.x + 50, gridBox.y + 50);

    await expect(page.locator('text=Tiles: 0')).toBeVisible();
  });
});
