import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const out = new URL('../public/projects/', import.meta.url);
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const manifest = {};
const nvrmindUrl =
  process.env.LUME_NVRMIND_URL || 'http://127.0.0.1:5174/index.html';
async function start(id, url) {
  await mkdir(new URL(`${id}/`, out), { recursive: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 960 },
    reducedMotion: 'reduce',
  });
  const response = await page.goto(url, {
    waitUntil: 'networkidle',
    timeout: 45000,
  });
  if (!response.ok()) throw new Error(`${id}: ${response.status()}`);
  await page.evaluate(() => document.fonts.ready);
  manifest[id] = [];
  return page;
}
async function shot(page, id, label, selector) {
  if (manifest[id].length >= 6) throw new Error('Limite de seis capturas.');
  if (selector)
    await page
      .locator(selector)
      .first()
      .evaluate((el) =>
        window.scrollTo({
          top: el.getBoundingClientRect().top + scrollY - 90,
          behavior: 'instant',
        }),
      );
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images)
        .filter((img) => {
          const r = img.getBoundingClientRect();
          return r.bottom > 0 && r.top < innerHeight;
        })
        .map((img) => img.decode().catch(() => {})),
    );
  });
  await page.waitForTimeout(400);
  const number = String(manifest[id].length + 1).padStart(2, '0');
  const src = `projects/${id}/${number}.jpg`;
  await page.screenshot({
    path: fileURLToPath(new URL(`${id}/${number}.jpg`, out)),
    type: 'jpeg',
    quality: 90,
  });
  const { width, height } = page.viewportSize();
  manifest[id].push({
    src,
    label,
    alt: `${label} — captura real da interface de ${id === 'mypace' ? 'MyPace' : id === 'arquibancada' ? 'Arquibancada Store' : id === 'nvrmind' ? 'NVRMIND' : id === 'burgues' ? 'Burguês' : 'Yuugan Sushi'}`,
    width,
    height,
  });
  console.log(`${id}: ${label}`);
}
try {
  let page = await start('mypace', 'https://sammuelldev.github.io/my-pace/');
  await page.locator('#authForms').waitFor({ state: 'visible' });
  await shot(page, 'mypace', 'Acesso ao MyPace');
  await page.getByRole('tab', { name: 'Criar conta' }).click();
  await shot(page, 'mypace', 'Criação de conta');
  await page.getByRole('tab', { name: 'Entrar', exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await shot(page, 'mypace', 'Acesso no celular');
  await page.close();

  page = await start(
    'arquibancada',
    'https://sammuelldev.github.io/loja-de-camisas/',
  );
  await shot(page, 'arquibancada', 'Página inicial');
  await shot(page, 'arquibancada', 'Identidade da loja', '.quem-somos');
  await shot(page, 'arquibancada', 'Catálogo de camisas', '#catalogo');
  await page.locator('#searchInput').fill('Flamengo');
  await shot(page, 'arquibancada', 'Busca por time', '#catalogo');
  await page.locator('#searchInput').fill('');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await shot(page, 'arquibancada', 'Versão para celular');
  await page.close();

  page = await start('nvrmind', nvrmindUrl);
  await shot(page, 'nvrmind', 'Página inicial');
  await shot(page, 'nvrmind', 'Coleção 001', '#colecao');
  await shot(page, 'nvrmind', 'Universo da marca', '#manifesto');
  await shot(page, 'nvrmind', 'Editorial', '#editorial');
  await page.locator('a[href*="?produto="]').first().click();
  await page.locator('.purchase-panel').waitFor();
  await shot(page, 'nvrmind', 'Página de produto');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(nvrmindUrl, { waitUntil: 'networkidle' });
  await shot(page, 'nvrmind', 'Versão para celular');
  await page.close();

  page = await start(
    'burgues',
    'https://sammuelldev.github.io/burgues-hamburgueria/',
  );
  await shot(page, 'burgues', 'Página inicial');
  await shot(page, 'burgues', 'Cardápio', '#cardapio');
  await page
    .getByRole('button', {
      name: 'Ver detalhes de Clássico Burguês',
      exact: true,
    })
    .click();
  await page.getByRole('dialog').waitFor();
  await shot(page, 'burgues', 'Detalhes do hambúrguer');
  await page.keyboard.press('Escape');
  await shot(page, 'burgues', 'A hamburgueria', '#historia');
  await shot(page, 'burgues', 'Galeria do ambiente', '#casa');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await shot(page, 'burgues', 'Versão para celular');
  await page.close();

  page = await start('yuugan', 'https://sammuelldev.github.io/yuugan-sushi/');
  await shot(page, 'yuugan', 'Página inicial');
  await shot(page, 'yuugan', 'Seleção de pratos', '#assinaturas');
  await shot(page, 'yuugan', 'Cardápio', '#cardapio');
  await shot(page, 'yuugan', 'Essência do restaurante', '#essencia');
  await shot(page, 'yuugan', 'Galeria gastronômica', '#experiencia');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await shot(page, 'yuugan', 'Versão para celular');
  await page.close();
  await writeFile(
    new URL('../lib/gallery-images.json', import.meta.url),
    JSON.stringify(manifest, null, 2) + '\n',
  );
  console.log('Capturas concluídas; dados salvos em lib/gallery-images.json.');
} finally {
  await browser.close();
}
