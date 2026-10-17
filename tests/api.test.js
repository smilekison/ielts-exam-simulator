'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const session = require('express-session');
const { createDatabase } = require('../server/database');
const { createApp } = require('../server/app');

function setup() {
  const db = createDatabase(':memory:');
  const app = createApp({ db, sessionStore: new session.MemoryStore(), sessionSecret: 'test-session-secret-that-is-long-enough-123456' });
  return { db, app, agent: request.agent(app) };
}

test('health and configuration endpoints are available', async t => {
  const { db, agent } = setup();
  t.after(() => db.close());
  const health = await agent.get('/api/health').expect(200);
  assert.equal(health.body.status, 'ok');
  const config = await agent.get('/api/config').expect(200);
  assert.equal(config.body.skills.find(skill => skill.id === 'Reading').questionCount, 40);
  const catalog = await agent.get('/api/tests').expect(200);
  assert.equal(catalog.body.version, 1);
  const reading = await agent.get('/api/tests/Reading').expect(200);
  assert.equal(reading.body.test.passages.length, 3);
  assert.equal(reading.body.test.passages.reduce((total, passage) => total + passage.qs.length, 0), 40);
  assert.equal(JSON.stringify(reading.body).includes('answerKeys'), false, 'Public question API must not expose the answer key');
  await agent.get('/api/tests/Unknown').expect(404);
});

test('registration validates inputs, hashes password and supports sign-in state', async t => {
  const { db, agent } = setup();
  t.after(() => db.close());
  await agent.post('/api/auth/register').send({ email: 'bad-email', password: '1234567890' }).expect(400);
  await agent.post('/api/auth/register').send({ email: 'student@example.com', password: 'short' }).expect(400);
  const response = await agent.post('/api/auth/register').send({ email: ' Student@example.com ', password: 'a-long-practice-password' }).expect(201);
  assert.equal(response.body.user.email, 'student@example.com');
  assert.equal(db.prepare('SELECT password_hash FROM users WHERE email=?').get('student@example.com').password_hash.startsWith('$2'), true);
  await agent.get('/api/auth/me').expect(200).then(result => assert.equal(result.body.user.email, 'student@example.com'));
  await agent.post('/api/auth/register').send({ email: 'student@example.com', password: 'a-long-practice-password' }).expect(409);
  await agent.post('/api/auth/logout').expect(204);
  await agent.get('/api/auth/me').expect(200).then(result => assert.equal(result.body.user, null));
  await agent.post('/api/auth/login').send({ email: 'student@example.com', password: 'wrong-password' }).expect(401);
  await agent.post('/api/auth/login').send({ email: 'student@example.com', password: 'a-long-practice-password' }).expect(200);
});

test('attempts autosave, resume and score on the server, then reject further writes', async t => {
  const { db, agent } = setup();
  t.after(() => db.close());
  await agent.post('/api/auth/register').send({ email: 'reader@example.com', password: 'a-long-practice-password' }).expect(201);
  await agent.post('/api/attempts').send({ skill: 'Unknown' }).expect(400);
  const created = await agent.post('/api/attempts').send({ skill: 'Listening' }).expect(201);
  const id = created.body.attempt.id;
  assert.equal(created.body.attempt.remainingSeconds, 1800);
  const answers = { 1: 'Westbrook Language Centre', 2: '14 October', 3: 'Tuesday and Thursday' };
  await agent.put('/api/attempts/' + id).send({ answers, writing: {}, notes: 'Remember time expressions', remainingSeconds: 1200 }).expect(200);
  const resumed = await agent.get('/api/attempts/' + id).expect(200);
  assert.equal(resumed.body.attempt.answers['1'], 'Westbrook Language Centre');
  assert.equal(resumed.body.attempt.remainingSeconds, 1200);
  const submitted = await agent.post('/api/attempts/' + id + '/submit').send({ answers, writing: {}, notes: 'Final notes', remainingSeconds: 1190 }).expect(200);
  assert.equal(submitted.body.attempt.status, 'submitted');
  assert.equal(submitted.body.attempt.result.correct, 3);
  assert.equal(submitted.body.attempt.result.total, 40);
  await agent.put('/api/attempts/' + id).send({ answers, writing: {}, notes: '', remainingSeconds: 1000 }).expect(409);
  const history = await agent.get('/api/attempts').expect(200);
  assert.equal(history.body.attempts.length, 1);
  assert.equal(history.body.attempts[0].result.correct, 3);
});

test('attempt ownership is enforced between accounts', async t => {
  const db = createDatabase(':memory:');
  const app = createApp({ db, sessionStore: new session.MemoryStore(), sessionSecret: 'test-session-secret-that-is-long-enough-123456' });
  const first = request.agent(app);
  const second = request.agent(app);
  t.after(() => db.close());
  await first.post('/api/auth/register').send({ email: 'first@example.com', password: 'a-long-practice-password' }).expect(201);
  const created = await first.post('/api/attempts').send({ skill: 'Reading' }).expect(201);
  await second.post('/api/auth/register').send({ email: 'second@example.com', password: 'another-long-password-123' }).expect(201);
  await second.get('/api/attempts/' + created.body.attempt.id).expect(404);
  await second.put('/api/attempts/' + created.body.attempt.id).send({ answers: {}, writing: {}, notes: '', remainingSeconds: 10 }).expect(404);
});

test('attempt payloads are bounded and remaining time is validated', async t => {
  const { db, agent } = setup();
  t.after(() => db.close());
  await agent.post('/api/auth/register').send({ email: 'limits@example.com', password: 'a-long-practice-password' }).expect(201);
  const created = await agent.post('/api/attempts').send({ skill: 'Reading' }).expect(201);
  const id = created.body.attempt.id;
  await agent.put('/api/attempts/' + id).send({ answers: [], writing: {}, notes: '', remainingSeconds: 60 }).expect(400);
  await agent.put('/api/attempts/' + id).send({ answers: {}, writing: {}, notes: '', remainingSeconds: 3601 }).expect(400);
  await agent.put('/api/attempts/' + id).send({ answers: {}, writing: {}, notes: 'x'.repeat(20001), remainingSeconds: 60 }).expect(400);
});
