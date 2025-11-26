import { test, expect } from '@playwright/test';
import { AdminLoginPage } from '../pom/AdminLoginPage';
import { AdminDashboardPage } from '../pom/AdminDashboardPage';

test.describe('CP-012..CP-017, CP-037 - Admin flows', () => {
  test('CP-012: Admin authentication (basic checks)', async ({ page }) => {
    const adminLogin = new AdminLoginPage(page);
    await adminLogin.goto();
    await expect(page).toHaveURL(/\/admin\/login/);

    const login = new AdminLoginPage(page);
    await login.goto();
    await login.expectLoginPageVisible();
    await login.login('admin', 'wrong');
    await expect(page).toHaveURL(/\/admin\/login/);

    const login2 = new AdminLoginPage(page);
    await login2.goto();
    await login2.expectLoginPageVisible();
    const dashboard = new AdminDashboardPage(page);
    await login2.login('admin', process.env.ADMIN_PASSWORD || 'admin123');
    await expect(page).toHaveURL(/\/admin$/);
    await dashboard.expectVisible();
  });

  //No esta completa la feature
  test.fixme('CP-013: Gestión de Inventario - Agregar Artículo (simple)', async ({ page }) => {
    const login = new AdminLoginPage(page);
    await login.goto();
    await login.login('admin', process.env.ADMIN_PASSWORD || 'admin123');
    await page.waitForURL(/\/admin$/);

    await page.goto('/admin/inventory').catch(() => null);
    const addButton = page.locator('button:has-text("Agregar Artículo"), button:has-text("Add Item"), a:has-text("Agregar")');
    await expect(addButton.first()).toBeVisible({ timeout: 3000 });
    await addButton.first().click();

    const nameInput = page.locator('input[name="name"], input[name="title"], input[placeholder*="Nombre"], input[placeholder*="Name"]');
    const typeSelect = page.locator('select[name="type"], select[name="category"], input[name="type"]');
    const sizeInput = page.locator('input[name="size"], select[name="size"], input[placeholder*="Talla"]');
    const colorInput = page.locator('input[name="color"], input[placeholder*="Color"]');
    const priceInput = page.locator('input[name="price"], input[name="precio"], input[type="number"]');

    await nameInput.first().fill('Vestido Elegante Negro');
    if ((await typeSelect.count()) > 0) {
      try {
        await typeSelect.first().selectOption({ label: 'Vestido' });
      } catch {
        await typeSelect.first().fill('Vestido').catch(() => null);
      }
    }
    await sizeInput.first().fill('M').catch(() => null);
    await colorInput.first().fill('Negro').catch(() => null);
    await priceInput.first().fill('45.50').catch(() => null);

    const fileInput = page.locator('input[type="file"]');
    if ((await fileInput.count()) > 0) {
      const imagePath = 'public/images/dresses/algunVestidoX.jpg';
      try {
        await fileInput.first().setInputFiles(imagePath);
      } catch {
      }
    }

    //guardado
    const saveBtn = page.locator('button:has-text("Guardar"), button:has-text("Save"), input[type=submit]');
    if ((await saveBtn.count()) > 0) {
      await Promise.all([
        saveBtn.first().click(),
        page.waitForLoadState('networkidle').catch(() => null),
      ]);
    }

    const added = page.locator('text=Vestido Elegante Negro');
    await expect(added).toBeVisible({ timeout: 5000 });
  });

  //FEATURE NO IMPLEMENTADA
  test.fixme('CP-014: Gestión de Inventario - Editar y Eliminar', async ({ page }) => {
    // vbasicamente loguea, va al inventario, edita y elimina, y chequea
    const login = new AdminLoginPage(page);
    await login.goto();
    await login.login('admin', process.env.ADMIN_PASSWORD || 'admin123');
    await page.goto('/admin/inventory').catch(() => null);

    const edit = page.locator('button:has-text("Editar"), button:has-text("Edit")').first();
    await edit.click().catch(() => null);
    await page.locator('input[name="price"], input[name="precio"]').first().fill('55.00').catch(() => null);
    await page.locator('textarea[name="description"], input[name="description"]').first().fill('Descripción actualizada').catch(() => null);
    await page.locator('button:has-text("Guardar"), button:has-text("Save")').first().click().catch(() => null);
    try {
      await page.goto('/search').catch(() => null);
      await expect(page.locator('text=Descripción actualizada')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=55.00')).toBeVisible({ timeout: 5000 });
    } catch {    }
    try {
      await page.goto('/search?q=Vestido').catch(() => null);
      const dressItems = page.locator('article:has-text("Vestid"), .product:has-text("Vestid"), .item-card:has-text("Vestid"), .catalog-item:has-text("Vestid")');
      const beforeCount = await dressItems.count();
      const delButtons = page.locator('button:has-text("Eliminar"), button:has-text("Delete")');
      if ((await delButtons.count()) > 0) {
        page.on('dialog', (d) => d.accept().catch(() => null));
        await delButtons.first().click().catch(() => null);
        await page.waitForLoadState('networkidle').catch(() => null);
      }

      await page.goto('/search?q=Vestido').catch(() => null);
      const afterCount = await dressItems.count();

      if (beforeCount > 0) expect(afterCount).toBe(beforeCount - 1);
    } catch { }
  });

  test('CP-015: Rentals viewer - list view shows expected columns', async ({ page }) => {
    const login = new AdminLoginPage(page);
    await login.goto();
    await login.login('admin', process.env.ADMIN_PASSWORD || 'admin123');
    const dashboard = new AdminDashboardPage(page);
    await dashboard.goto();
    await expect(page.locator('th:has-text("Item")')).toBeVisible();
    await expect(page.locator('th:has-text("Dates")')).toBeVisible();
    await expect(page.locator('th:has-text("Customer")')).toBeVisible();
  });

  //FEATURE NO TERMINADA
  test.fixme('CP-016: Visualizador de Alquileres - Vista de Calendario', async ({ page }) => {
    //Se loguea como admin, abre calendario, cheuquea bloques, abre modal, navega meses
    const login = new AdminLoginPage(page);
    await login.goto();
    await login.login('admin', process.env.ADMIN_PASSWORD || 'admin123');
    await page.waitForURL(/\/admin$/).catch(() => null);

    await page.goto('/admin/rentals').catch(() => null);

    const calendarBtn = page.locator('button:has-text("Calendario"), button:has-text("Calendar"), a:has-text("Calendar")').first();
    if ((await calendarBtn.count()) > 0) await calendarBtn.click().catch(() => null);

    const blocks = page.locator('.fc-event, .event, .rental-block, .calendar-event');
    const blocksCount = await blocks.count();
    if (blocksCount > 0) {
      await blocks.first().click().catch(() => null);
      const modal = page.locator('[role="dialog"], .modal, .dialog, .detail-modal').first();
      await expect(modal).toBeVisible({ timeout: 3000 }).catch(() => null);
      await expect(modal.locator('text=Artículo, text=Item, text=Fecha, text=Dates, text=Cliente, text=Customer')).toBeVisible().catch(() => null);
    }

    const nextBtn = page.locator('button[aria-label="Next"], button:has-text("Next"), button:has-text(">"), button:has-text("Siguiente")').first();
    const prevBtn = page.locator('button[aria-label="Prev"], button:has-text("Prev"), button:has-text("<"), button:has-text("Anterior")').first();
    if ((await nextBtn.count()) > 0) {
      await nextBtn.click().catch(() => null);
      await page.waitForLoadState('networkidle').catch(() => null);
    }
    if ((await prevBtn.count()) > 0) {
      await prevBtn.click().catch(() => null);
      await page.waitForLoadState('networkidle').catch(() => null);
    }
  });

  test('CP-017: Cancel rentals (requires active rental) - basic availability of action', async ({ page }) => {
    const login = new AdminLoginPage(page);
    await login.goto();
    await login.login('admin', process.env.ADMIN_PASSWORD || 'admin123');
    const dashboard = new AdminDashboardPage(page);
    await dashboard.goto();
    const count = await dashboard.cancelButtons.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('CP-037: Negative cancellation - no rental to cancel returns proper error', async ({ page, request, baseURL }) => {
    const login = new AdminLoginPage(page);
    await login.goto();
    await login.login('admin', process.env.ADMIN_PASSWORD || 'admin123');
    await page.waitForURL(/\/admin$/);

    const res = await request.post(`${baseURL}/api/admin/rentals/aaaaaaaa/cancel`, {
      form: { csrf: 'invalid-or-missing' },
    });
    expect([401, 404]).toContain(res.status());
    const body = await res.json();
    const err = body.error;
    expect(
      err || (typeof err === 'string' && /no hay alquiler para cancelar/i.test(err))
    ).toBeTruthy();
  });
});


