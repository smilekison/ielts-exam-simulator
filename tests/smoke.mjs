import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', error => { errors.push(error.message); console.error('PAGEERROR:', error.message); });
try {
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await assert.doesNotReject(() => page.getByRole('heading', { name: 'Computer-Based IELTS Practice' }).waitFor());

  // Reading must expose all 40 numbered questions and preserve answers.
  await page.locator('button[data-skill="Reading"]').click();
  await page.locator('#panegrid:not(.hide)').waitFor();
  await page.locator('#questionNav button').first().waitFor();
  assert.equal(await page.locator('#questionNav button').count(), 40, 'Reading navigation should contain 40 questions');
  await page.locator('[data-answer="1"]').fill('April');
  await page.locator('input[name="q3"][value="B"]').check();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('british-ielts-practice-simulator-v2')).answers.Reading['1'] === 'April');
  await page.locator('[data-jump="40"]').click();
  await page.locator('#qblock-40').waitFor();
  assert.match(await page.locator('#rightPane').innerText(), /What is the main point of the passage/);

  // Listening exposes 40 questions and answer submission shows a scored result.
  await page.getByRole('button', { name: /Test menu/ }).click();
  await page.locator('button[data-skill="Listening"]').click();
  await page.locator('#panegrid:not(.hide)').waitFor();
  assert.equal(await page.locator('#questionNav button').count(), 40, 'Listening navigation should contain 40 questions');
  await page.locator('[data-answer="1"]').fill('Westbrook Language Centre');
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Finish' }).click();
  await page.getByText('Correct answers', { exact: false }).waitFor();
  await page.getByRole('button', { name: 'Close' }).click();

  // Writing tasks switch and autosave; Speaking exposes all three parts.
  await page.getByRole('button', { name: /Test menu/ }).click();
  await page.locator('button[data-skill="Writing"]').click();
  await page.locator('#panegrid:not(.hide)').waitFor();
  await page.locator('#writingText').fill('This is a short draft for an automated smoke test.');
  await page.locator('.nav button[data-jump="2"]').click();
  await page.locator('#writingText').waitFor();
  await page.getByRole('button', { name: /Test menu/ }).click();
  await page.locator('button[data-skill="Speaking"]').click();
  await page.locator('#speakingView:not(.hide)').waitFor();
  await page.getByRole('button', { name: 'Part 2' }).click();
  await page.getByRole('button', { name: /Start 1-minute preparation/ }).waitFor();

  assert.deepEqual(errors, [], 'Browser should not report uncaught JavaScript errors');
  console.log('Smoke test passed: Reading/Listening navigation, saved answers, scoring dialog, Writing tasks and Speaking transitions.');
} finally {
  await browser.close();
}
