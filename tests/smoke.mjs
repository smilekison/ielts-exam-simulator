import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', error => { errors.push(error.message); console.error('PAGEERROR:', error.message); });
page.on('console', message => { if (message.type() === 'error') console.error('BROWSER CONSOLE:', message.text()); });
try {
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await assert.doesNotReject(() => page.getByRole('heading', { name: 'Computer-Based IELTS Practice' }).waitFor());
  assert.equal(await page.locator('#toolbar').evaluate(el => el.classList.contains('hide')), true, 'Exam tools should be hidden on the home dashboard');

  // Reading must expose all 40 numbered questions and preserve answers.
  await page.locator('button[data-skill="Reading"]').click();
  await page.locator('#panegrid:not(.hide)').waitFor();
  await page.locator('#toolbar:not(.hide)').waitFor();
  await page.locator('#timer:not(.hide)').waitFor();
  await page.locator('#questionNav button').first().waitFor();
  assert.equal(await page.locator('#questionNav button').count(), 40, 'Reading navigation should contain 40 questions');
  const firstFlag = page.locator('.flag-btn[data-flag="1"]');
  await firstFlag.click();
  assert.equal(await firstFlag.getAttribute('aria-pressed'), 'true', 'Question review flag should turn on');
  assert.ok((await page.locator('#questionNav button[data-jump="1"]').getAttribute('class')).includes('flagged'), 'Flag should appear on the question palette');
  await firstFlag.click();
  assert.equal(await firstFlag.getAttribute('aria-pressed'), 'false', 'Question review flag should turn off');
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

  // Mobile viewport sanity check: cards and question navigation remain usable.
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  mobile.on('pageerror', error => { errors.push('mobile: ' + error.message); console.error('MOBILE PAGEERROR:', error.message); });
  await mobile.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await mobile.locator('button[data-skill="Reading"]').click();
  await mobile.locator('#panegrid:not(.hide)').waitFor();
  assert.equal(await mobile.locator('#questionNav button').count(), 40, 'Mobile Reading navigation should contain 40 questions');
  await mobile.locator('[data-jump="40"]').click();
  await mobile.locator('#qblock-40').waitFor();
  await mobile.close();

  // Account flow: register, persist an answer to SQLite, return to the menu and resume it.
  const accountPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  accountPage.on('pageerror', error => { errors.push('account: ' + error.message); console.error('ACCOUNT PAGEERROR:', error.message); });
  await accountPage.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await accountPage.locator('#accountBtn').click();
  await accountPage.locator('button[data-auth-mode="register"]').click();
  await accountPage.locator('#authEmail').fill('e2e-' + Date.now() + '@example.com');
  await accountPage.locator('#authPassword').fill('correct-horse-practice-123');
  await accountPage.locator('#authForm button[type="submit"]').click();
  await accountPage.getByText('No saved attempts yet.', { exact: false }).waitFor();
  await accountPage.getByRole('button', { name: 'Close' }).click();
  await accountPage.locator('button[data-skill="Reading"]').click();
  await accountPage.locator('#panegrid:not(.hide)').waitFor();
  await accountPage.locator('[data-answer="1"]').fill('April');
  await accountPage.waitForTimeout(5000);
  await accountPage.getByRole('button', { name: /Test menu/ }).click();
  await accountPage.locator('#accountBtn').click();
  await accountPage.getByRole('button', { name: 'Resume' }).waitFor();
  await accountPage.getByRole('button', { name: 'Resume' }).click();
  await accountPage.locator('[data-answer="1"]').waitFor();
  assert.equal(await accountPage.locator('[data-answer="1"]').inputValue(), 'April', 'Account should restore saved Reading answers');
  await accountPage.close();

  assert.deepEqual(errors, [], 'Desktop, mobile and account flows should not report uncaught JavaScript errors');
  console.log('Smoke test passed: responsive four-skill UI, local and account persistence, resume, scoring and authentication.');
} finally {
  await browser.close();
}
