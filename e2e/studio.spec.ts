import { expect, test, type Page, type Route } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const shots = 'docs/screenshots';

const sampleText =
  'Hola, el sistema de texto a voz está funcionando correctamente.';

const track = {
  id: 'track-1',
  text: sampleText,
  voice: 'Jasper',
  expression: 'happy' as string | null,
  duration_seconds: 3.2,
  sample_rate: 24000,
  format: 'wav',
  created_at: '2026-10-17T17:04:00.000Z',
  download_url: 'http://127.0.0.1:8000/api/v1/speech/track-1',
};

function silentWav(): Buffer {
  const dataSize = 24000 * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(24000, 24);
  buffer.writeUInt32LE(48000, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  return buffer;
}

async function fulfillTrack(route: Route, body = track): Promise<void> {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

async function chooseVoice(page: Page, name: string): Promise<void> {
  await page.getByRole('button', { name, exact: false }).click();
}

test.beforeAll(() => {
  mkdirSync(shots, { recursive: true });
});

test.beforeEach(async ({ page }) => {
  await page.route('**/api/v1/speech/track-1', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'audio/wav',
      body: silentWav(),
    });
  });
});

test('opens the empty studio', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Purr');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { name: 'Purr' })).toBeVisible();
  await expect(page.getByText('Texto a voz local')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Bella' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByRole('button', { name: 'Sin etiqueta' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByText('0 / 500')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Generar voz' })).toBeDisabled();
  await expect(page.getByText('El audio aparecerá aquí.')).toBeVisible();
  await expect(page.locator('audio')).toHaveCount(0);

  await page.screenshot({
    path: `${shots}/estudio-inicial.png`,
    fullPage: true,
  });
});

test('stacks the voices on a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const columns = await page
    .locator('.studio__voices')
    .evaluate((element) => getComputedStyle(element).gridTemplateColumns);
  expect(columns.split(' ').length).toBe(2);

  const card = await page.locator('.studio__card').boundingBox();
  const button = await page.getByRole('button', { name: 'Generar voz' }).boundingBox();
  expect(card).not.toBeNull();
  expect(button).not.toBeNull();
  expect(button!.width).toBeGreaterThan(card!.width * 0.8);

  await page.screenshot({
    path: `${shots}/estudio-movil.png`,
    fullPage: true,
  });
});

test('blocks text over 500 characters before calling the API', async ({ page }) => {
  let called = false;
  await page.route('**/api/v1/speech/generate', async (route) => {
    called = true;
    await route.abort();
  });
  await page.goto('/');
  await page.locator('#speech-text').fill('a'.repeat(501));

  await expect(page.getByRole('alert')).toHaveText(
    'El texto tiene 501 caracteres. El máximo permitido es 500.',
  );
  await expect(page.getByRole('button', { name: 'Generar voz' })).toBeDisabled();
  expect(called).toBe(false);

  await page.screenshot({
    path: `${shots}/estudio-error.png`,
    fullPage: true,
  });
});

test('generates a track and keeps it when the next request fails', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let calls = 0;
  await page.route('**/api/v1/speech/generate', async (route) => {
    calls += 1;
    if (calls === 1) {
      await gate;
      await fulfillTrack(route);
      return;
    }
    await route.abort();
  });

  await page.goto('/');
  await page.locator('#speech-text').fill(sampleText);
  await chooseVoice(page, 'Jasper');
  await page.getByRole('button', { name: 'Alegre' }).click();
  const firstRequest = page.waitForRequest('**/api/v1/speech/generate');
  await page.getByRole('button', { name: 'Generar voz' }).click();

  await expect(page.getByRole('button', { name: 'Generando…' })).toBeDisabled();
  await expect(
    page.getByText('La primera vez puede tardar porque el modelo se descarga.'),
  ).toBeVisible();
  await page.screenshot({
    path: `${shots}/estudio-generando.png`,
    fullPage: true,
  });

  const request = (await firstRequest).postDataJSON() as {
    text: string;
    voice: string;
    expression?: string;
    normalize: boolean;
  };
  expect(request).toEqual({
    text: sampleText,
    voice: 'Jasper',
    expression: 'happy',
    normalize: true,
  });
  release();

  await expect(page.locator('audio')).toBeVisible();
  await expect
    .poll(() =>
      page.locator('audio').evaluate((element: HTMLAudioElement) => element.duration),
    )
    .toBeGreaterThan(0);
  await expect(page.locator('.studio__result')).toContainText(sampleText);
  await expect(page.locator('.studio__result')).toContainText(
    'Jasper · Alegre · 3,2 s',
  );
  await expect(page.getByRole('link', { name: 'Descargar WAV' })).toHaveAttribute(
    'href',
    track.download_url,
  );
  await page.screenshot({
    path: `${shots}/estudio-listo.png`,
    fullPage: true,
  });

  await page.locator('#speech-text').fill('Segundo intento');
  await page.getByRole('button', { name: 'Generar voz' }).click();
  await expect(page.getByRole('alert')).toHaveText(
    'No se pudo contactar el servicio.',
  );
  await expect(page.locator('audio')).toBeVisible();
  await expect(page.getByText(sampleText)).toBeVisible();
});

test('omits the expression and can turn normalization off', async ({ page }) => {
  const bodies: unknown[] = [];
  await page.route('**/api/v1/speech/generate', async (route) => {
    bodies.push(route.request().postDataJSON());
    await fulfillTrack(route, { ...track, voice: 'Bella', expression: null });
  });

  await page.goto('/');
  await page.locator('#speech-text').fill('  Hola  ');
  await page.getByRole('button', { name: 'Generar voz' }).click();
  await expect(page.locator('audio')).toBeVisible();
  expect(bodies[0]).toEqual({
    text: 'Hola',
    voice: 'Bella',
    normalize: true,
  });

  await page.getByText('Opciones').click();
  await page.getByRole('checkbox', { name: 'Normalizar audio' }).uncheck();
  await page.locator('#speech-text').fill('Sin normalizar');
  await page.getByRole('button', { name: 'Generar voz' }).click();
  await expect.poll(() => bodies.length).toBe(2);
  expect(bodies[1]).toEqual({
    text: 'Sin normalizar',
    voice: 'Bella',
    normalize: false,
  });
});
