import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const out = new URL('../public/projects/', import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  for (const [id, url] of [
    ['mypace', 'https://sammuelldev.github.io/my-pace/'],
    ['arquibancada', 'https://sammuelldev.github.io/loja-de-camisas/'],
    ['burgues', 'https://sammuelldev.github.io/burgues-hamburgueria/'],
    ['yuugan', 'https://sammuelldev.github.io/yuugan-sushi/'],
  ]) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 960 },
      deviceScaleFactor: 1,
    });
    const response = await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 45000,
    });
    if (!response.ok()) throw new Error(`${id}: HTTP ${response.status()}`);
    await page.evaluate(() => document.fonts.ready);
    if (id === 'mypace')
      await page.locator('#authForms').waitFor({ state: 'visible' });
    await page.screenshot({ path: fileURLToPath(new URL(`${id}.png`, out)) });
    console.log(
      JSON.stringify({
        id,
        url: page.url(),
        title: await page.title(),
        status: response.status(),
      }),
    );
    await page.close();
  }
} finally {
  await browser.close();
}
