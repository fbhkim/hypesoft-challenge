
import { test, expect } from '@playwright/test';

test.describe('Gestão de Produtos', () => {
  test.beforeEach(async ({ page }) => {
    // Simular login (ou usar credenciais reais em ambiente de teste)
    await page.goto('/auth/login');
    // Aqui você pode simular ou automatizar o login no Keycloak
    await page.waitForURL('/dashboard');
  });

  test('deve criar um novo produto', async ({ page }) => {
    await page.click('text=Produtos');
    await page.waitForURL('/products');

    await page.click('text=Novo Produto');
    await page.waitForURL('/products/new');

    await page.fill('input[placeholder="Ex: Camiseta Premium"]', 'Produto Teste E2E');
    await page.fill('textarea', 'Descrição de teste');
    await page.fill('input[placeholder="0.00"]', '99.90');
    await page.fill('input[placeholder="0"]', '20');

    await page.selectOption('select', '1'); // Categoria
    await page.click('text=Salvar Produto');

    await page.waitForSelector('text=Produto criado com sucesso');
    await expect(page.locator('text=Produto Teste E2E')).toBeVisible();
  });

  test('deve buscar produto por nome', async ({ page }) => {
    await page.goto('/products');
    await page.fill('input[placeholder="Buscar por nome..."]', 'Produto Teste E2E');
    await page.waitForTimeout(1000); // Aguardar debounce

    await expect(page.locator('text=Produto Teste E2E')).toBeVisible();
  });
});