import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.LUME_TEST_URL || 'http://127.0.0.1:5173/';
await mkdir('validation', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const findings = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 960 },
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400 && response.url().startsWith(base))
      errors.push(`HTTP ${response.status()} ${response.url()}`);
  });
  const demo = new URL('projetos/nvrmind/index.html', base).href;
  await page.goto(demo, { waitUntil: 'networkidle' });
  await page.locator('h1').waitFor();
  assert.match(await page.locator('h1').textContent(), /CIDADE/);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'public/projects/nvrmind.png' });
  await page
    .getByRole('link', { name: 'EXPLORAR A COLEÇÃO', exact: true })
    .first()
    .click();
  const firstProduct = page.locator('a[href*="?produto="]').first();
  await firstProduct.click();
  await page.locator('.purchase-panel').waitFor();
  await page.getByRole('button', { name: 'ADICIONAR À SACOLA' }).click();
  assert.match(
    await page.locator('.form-feedback.error').textContent(),
    /Escolha um tamanho/,
  );
  await page.locator('#size-options button').first().click();
  await page.getByRole('button', { name: 'ADICIONAR À SACOLA' }).click();
  await page.getByRole('button', { name: 'REVISAR MINHA SELEÇÃO' }).click();
  await page.getByText('SUA SELEÇÃO ESTÁ SALVA.').waitFor();
  await page.getByRole('button', { name: 'Fechar sacola' }).click();
  await page.reload({ waitUntil: 'networkidle' });
  assert.match(await page.title(), /NVRMIND/);
  findings.push(
    'NVRMIND: página de produto, validação de tamanho, sacola, revisão e recarga funcionam.',
  );
  await page.goto(base, { waitUntil: 'networkidle' });
  for (const width of [320, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 960 });
    await page.evaluate(async () => {
      for (const img of document.images) img.loading = 'eager';
      await Promise.all(
        Array.from(document.images, (img) => img.decode().catch(() => {})),
      );
    });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `Overflow em ${width}px`,
    );
    assert.deepEqual(
      await page.evaluate(() =>
        Array.from(document.images)
          .filter((img) => !img.complete || !img.naturalWidth)
          .map((img) => img.src),
      ),
      [],
      `Imagem quebrada em ${width}px`,
    );
    if (width === 390 || width === 1440)
      await page.screenshot({
        path: `validation/lume-${width}.png`,
        fullPage: true,
      });
    findings.push(
      `Layout ${width}px: sem rolagem horizontal e sem imagens quebradas.`,
    );
  }
  assert.equal(await page.locator('.project').count(), 5);
  const missingAnchors = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .filter(
          (link) =>
            !document.getElementById(link.getAttribute('href').slice(1)),
        )
        .map((link) => link.getAttribute('href')),
    );
  assert.deepEqual(missingAnchors, []);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
  assert.equal(await page.locator('#menu-mobile').isVisible(), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#menu-mobile').isVisible(), false);
  assert.equal(
    await page
      .getByRole('button', { name: 'Abrir menu', exact: true })
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
  await page
    .locator('#menu-mobile')
    .getByRole('link', { name: 'Projetos' })
    .click();
  assert.equal(await page.locator('#menu-mobile').isVisible(), false);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    'auto',
  );
  await page
    .getByRole('link', { name: 'Vamos conversar', exact: true })
    .last()
    .click();
  await page.waitForURL('**/#contato');
  assert.deepEqual(errors, []);
  findings.push(
    'Navegação, menu móvel, tecla Escape, foco, contato e movimento reduzido verificados.',
  );
  findings.push(
    'Nenhum erro de execução ou resposta HTTP de erro nos recursos locais.',
  );
  console.log(findings.join('\n'));
  await writeFile(
    'validation/results.json',
    JSON.stringify(
      { base, checkedAt: new Date().toISOString(), findings },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
