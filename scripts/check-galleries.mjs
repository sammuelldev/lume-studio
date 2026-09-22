import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.LUME_TEST_URL || 'http://127.0.0.1:5173/';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
await mkdir('validation', { recursive: true });
const checks = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 960 },
  });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('response', (r) => {
    if (r.status() >= 400 && r.url().startsWith(base))
      errors.push(`${r.status()} ${r.url()}`);
  });
  assert.equal(
    (
      await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 })
    ).status(),
    200,
  );
  await page.locator('.gallery').first().waitFor({ timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator('.header-inner')
    .screenshot({ path: 'validation/logo-preto.png' });
  assert.equal(await page.locator('.project').count(), 5);
  assert.equal(
    await page.locator('.project a').count(),
    0,
    'Projetos não devem abrir outros sites.',
  );
  for (const text of [
    'Design & desenvolvimento web',
    'Da primeira ideia ao último detalhe.',
    'Design com intenção. Código com cuidado.',
    'Universos diferentes.',
    'Um olhar atento.',
    'O cuidado aparece nos detalhes.',
  ])
    assert.equal(
      await page.getByText(text, { exact: true }).count(),
      0,
      `Texto removido: ${text}`,
    );
  assert.equal(
    await page.evaluate(() => getComputedStyle(document.body).backgroundColor),
    'rgb(0, 0, 0)',
  );
  assert.match(
    await page
      .locator('.hero-bottom p')
      .evaluate((el) => getComputedStyle(el).fontFamily),
    /Inter/,
  );
  assert.match(
    await page.locator('h1').evaluate((el) => getComputedStyle(el).fontFamily),
    /Arial/,
  );
  for (const width of [320, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 960 });
    await page.evaluate(async () => {
      for (const img of document.images) img.loading = 'eager';
      await Promise.all(Array.from(document.images, (img) => img.decode()));
    });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `Overflow ${width}`,
    );
    if (width === 390 || width === 1440)
      await page.screenshot({
        path: `validation/galerias-${width}.png`,
        fullPage: true,
      });
  }
  checks.push(
    'Cinco larguras sem overflow, imagens carregadas, fundo preto e fontes verificadas.',
  );
  await page.setViewportSize({ width: 1440, height: 960 });
  for (const gallery of await page.locator('.gallery').all()) {
    const slides = await gallery.locator('.gallery-slide').count();
    assert(slides >= 2 && slides <= 6);
    const next = gallery.getByRole('button', { name: /Próxima imagem de/ });
    await next.click();
    await page.waitForTimeout(450);
    assert.match(await gallery.locator('.gallery-count').textContent(), /^02/);
    await gallery.locator('.gallery-dot').last().click();
    await page.waitForTimeout(450);
    assert.equal(await next.isDisabled(), true);
    await gallery.locator('.gallery-dot').first().click();
    await page.waitForTimeout(450);
    await gallery.locator('.gallery-image-button').first().click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    await page.keyboard.press('ArrowRight');
    assert.match(await dialog.textContent(), /2 de/);
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(
      await gallery
        .locator('.gallery-image-button')
        .first()
        .evaluate((el) => document.activeElement === el),
      true,
      'Foco deve voltar ao acionador.',
    );
    await gallery.locator('.gallery-dot').first().click();
  }
  checks.push(
    'Cinco galerias com até seis fotos: setas, indicadores, ampliação, teclado e Escape funcionam.',
  );
  const first = page.locator('.gallery').first();
  const rail = first.locator('.gallery-track');
  await rail.scrollIntoViewIfNeeded();
  await page.waitForTimeout(450);
  const box = await rail.boundingBox();
  await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.45);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.15, box.y + box.height * 0.45, {
    steps: 16,
  });
  await page.mouse.up();
  await page.waitForTimeout(450);
  assert.match(await first.locator('.gallery-count').textContent(), /^02/);
  assert.equal(
    await page.getByRole('dialog').count(),
    0,
    'Arrastar não pode abrir ampliação.',
  );
  checks.push('Arraste com mouse troca a captura sem abrir a ampliação.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    'auto',
  );
  await first.locator('.gallery-dot').first().click();
  await rail.focus();
  await page.keyboard.press('ArrowRight');
  assert.match(await first.locator('.gallery-count').textContent(), /^02/);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
  await page
    .locator('#menu-mobile')
    .getByRole('link', { name: 'Projetos' })
    .click();
  assert.equal(await page.locator('#menu-mobile').isVisible(), false);
  assert.deepEqual(errors, []);
  checks.push(
    'Movimento reduzido, navegação móvel e ausência de erros verificados.',
  );
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  mobile.on('pageerror', (error) => errors.push(error.message));
  await mobile.goto(base, { waitUntil: 'domcontentloaded' });
  const mobileGallery = mobile.locator('.gallery').last();
  await mobileGallery.scrollIntoViewIfNeeded();
  const mobileRail = mobileGallery.locator('.gallery-track');
  const touch = await mobile.context().newCDPSession(mobile);
  async function swipe(locator) {
    const rect = await locator.boundingBox();
    const y = rect.y + rect.height / 2;
    const x = rect.x + rect.width * 0.85;
    await touch.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x, y }],
    });
    for (let i = 1; i <= 12; i++) {
      await touch.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: x - (rect.width * 0.7 * i) / 12, y }],
      });
      await mobile.waitForTimeout(20);
    }
    await touch.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await mobile.waitForTimeout(600);
  }
  await swipe(mobileRail);
  assert.match(
    await mobileGallery.locator('.gallery-count').textContent(),
    /^02/,
  );
  assert.equal(await mobile.getByRole('dialog').count(), 0);
  await mobileGallery.locator('.gallery-image-button').nth(1).tap();
  const mobileDialog = mobile.getByRole('dialog');
  await mobileDialog.waitFor();
  await swipe(mobileDialog.locator('.gallery-dialog-image'));
  assert.match(await mobileDialog.textContent(), /3 de/);
  const dialogBox = await mobileDialog.boundingBox();
  assert(
    dialogBox.x >= 0 &&
      dialogBox.y >= 0 &&
      dialogBox.x + dialogBox.width <= 390 &&
      dialogBox.y + dialogBox.height <= 844,
  );
  await mobile.screenshot({ path: 'validation/ampliacao-390.png' });
  await mobile
    .getByRole('button', { name: 'Fechar galeria', exact: true })
    .tap();
  await mobileDialog.waitFor({ state: 'hidden' });
  assert.deepEqual(errors, []);
  checks.push(
    'Gesto de toque troca as fotos no carrossel e na ampliação; diálogo cabe no celular.',
  );
  await mobile.close();
  await writeFile(
    'validation/gallery-results.json',
    JSON.stringify({ base, checks }, null, 2),
  );
  console.log(checks.join('\n'));
} finally {
  await browser.close();
}
