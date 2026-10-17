'use strict';

const crypto = require('node:crypto');
const path = require('node:path');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const { scoreAnswers } = require('./answer-keys');
const questionBank = require('./question-bank');

const SKILLS = new Set(['Listening', 'Reading', 'Writing', 'Speaking']);
const DURATIONS = { Listening: 1800, Reading: 3600, Writing: 3600, Speaking: 840 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeUser(row) {
  return row ? { id: row.id, email: row.email, createdAt: row.created_at } : null;
}
function parseObject(value, maxBytes = 70000) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  try {
    if (Buffer.byteLength(JSON.stringify(value), 'utf8') > maxBytes) return null;
  } catch { return null; }
  return value;
}
function attemptFromRow(row) {
  return {
    id: row.id, skill: row.skill, status: row.status,
    answers: JSON.parse(row.answers_json || '{}'),
    writing: JSON.parse(row.writing_json || '{}'),
    notes: row.notes || '', remainingSeconds: row.remaining_seconds,
    result: row.result_json ? JSON.parse(row.result_json) : null,
    startedAt: row.started_at, updatedAt: row.updated_at, submittedAt: row.submitted_at
  };
}
function createApp({ db, sessionStore, sessionSecret = process.env.SESSION_SECRET || 'development-only-change-this-session-secret-32-chars', staticFile = path.join(__dirname, '..', 'index.html') }) {
  if (!db) throw new Error('A database connection is required.');
  const app = express();
  if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json({ limit: '100kb', strict: true }));
  app.use(express.urlencoded({ extended: false, limit: '10kb' }));
  app.use(session({
    name: 'ielts.sid',
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  }));

  app.use((req, res, next) => {
    if (req.path.startsWith('/api/') && !['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      const origin = req.get('origin');
      if (origin) {
        try {
          if (new URL(origin).host !== req.get('host')) return res.status(403).json({ error: 'Cross-origin request blocked.' });
        } catch { return res.status(403).json({ error: 'Invalid request origin.' }); }
      }
    }
    next();
  });

  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 12, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Too many authentication attempts. Please wait and try again.' } });
  const requireAuth = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Please sign in to access this feature.' });
    next();
  };
  const findOwnedAttempt = (req, res) => {
    const row = db.prepare('SELECT * FROM attempts WHERE id = ? AND user_id = ?').get(req.params.id, req.session.userId);
    if (!row) {
      res.status(404).json({ error: 'Practice attempt not found.' });
      return null;
    }
    return row;
  };

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: 'connected' }));
  const testCatalog = () => [
    { id: 'Listening', version: questionBank.version, durationSeconds: DURATIONS.Listening, sectionCount: questionBank.Listening.sections.length, questionCount: questionBank.Listening.sections.reduce((total, part) => total + part.questions.length, 0) },
    { id: 'Reading', version: questionBank.version, durationSeconds: DURATIONS.Reading, sectionCount: questionBank.Reading.passages.length, questionCount: questionBank.Reading.passages.reduce((total, passage) => total + passage.qs.length, 0) },
    { id: 'Writing', version: questionBank.version, durationSeconds: DURATIONS.Writing, taskCount: questionBank.Writing.tasks.length },
    { id: 'Speaking', version: questionBank.version, durationSeconds: DURATIONS.Speaking, partCount: questionBank.Speaking.parts.length }
  ];
  app.get('/api/config', (_req, res) => res.json({
    skills: testCatalog(), persistence: 'account-and-local-browser', scoring: 'unofficial-practice-estimate'
  }));
  app.get('/api/tests', (_req, res) => res.json({ version: questionBank.version, tests: testCatalog() }));
  app.get('/api/tests/:skill', (req, res) => {
    const skill = req.params.skill;
    if (!Object.prototype.hasOwnProperty.call(questionBank, skill) || !['Listening', 'Reading', 'Writing', 'Speaking'].includes(skill)) {
      return res.status(404).json({ error: 'Practice test not found.' });
    }
    res.json({ test: { skill, version: questionBank.version, ...questionBank[skill] } });
  });
  app.get('/api/auth/me', (req, res) => {
    if (!req.session.userId) return res.json({ user: null });
    const user = db.prepare('SELECT id,email,created_at FROM users WHERE id = ?').get(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.json({ user: null });
    }
    res.json({ user: safeUser(user) });
  });
  app.post('/api/auth/register', authLimiter, async (req, res, next) => {
    try {
      const email = String(req.body?.email || '').trim().toLowerCase();
      const password = String(req.body?.password || '');
      if (!EMAIL_RE.test(email) || email.length > 254) return res.status(400).json({ error: 'Enter a valid email address.' });
      if (password.length < 10 || password.length > 128) return res.status(400).json({ error: 'Password must be between 10 and 128 characters.' });
      if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) return res.status(409).json({ error: 'An account with this email already exists.' });
      const passwordHash = await bcrypt.hash(password, 12);
      const result = db.prepare('INSERT INTO users (email,password_hash) VALUES (?,?)').run(email, passwordHash);
      await new Promise((resolve, reject) => req.session.regenerate(err => err ? reject(err) : resolve()));
      req.session.userId = Number(result.lastInsertRowid);
      res.status(201).json({ user: safeUser(db.prepare('SELECT id,email,created_at FROM users WHERE id = ?').get(req.session.userId)) });
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ error: 'An account with this email already exists.' });
      next(error);
    }
  });
  app.post('/api/auth/login', authLimiter, async (req, res, next) => {
    try {
      const email = String(req.body?.email || '').trim().toLowerCase();
      const password = String(req.body?.password || '');
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      const valid = user ? await bcrypt.compare(password, user.password_hash) : false;
      if (!valid) return res.status(401).json({ error: 'Email or password is incorrect.' });
      db.prepare("UPDATE users SET last_login_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?").run(user.id);
      await new Promise((resolve, reject) => req.session.regenerate(err => err ? reject(err) : resolve()));
      req.session.userId = user.id;
      res.json({ user: safeUser(user) });
    } catch (error) { next(error); }
  });
  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(error => {
      if (error) return res.status(500).json({ error: 'Could not sign out. Please try again.' });
      res.clearCookie('ielts.sid', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
      res.status(204).end();
    });
  });

  app.get('/api/attempts', requireAuth, (req, res) => {
    const rows = db.prepare('SELECT id,skill,status,remaining_seconds,result_json,started_at,updated_at,submitted_at FROM attempts WHERE user_id = ? ORDER BY updated_at DESC LIMIT 50').all(req.session.userId);
    res.json({ attempts: rows.map(row => ({
      id: row.id, skill: row.skill, status: row.status, remainingSeconds: row.remaining_seconds,
      result: row.result_json ? JSON.parse(row.result_json) : null,
      startedAt: row.started_at, updatedAt: row.updated_at, submittedAt: row.submitted_at
    })) });
  });
  app.post('/api/attempts', requireAuth, (req, res) => {
    const skill = req.body?.skill;
    if (!SKILLS.has(skill)) return res.status(400).json({ error: 'Choose a valid practice skill.' });
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO attempts (id,user_id,skill,remaining_seconds) VALUES (?,?,?,?)').run(id, req.session.userId, skill, DURATIONS[skill]);
    res.status(201).json({ attempt: attemptFromRow(db.prepare('SELECT * FROM attempts WHERE id = ?').get(id)) });
  });
  app.get('/api/attempts/:id', requireAuth, (req, res) => {
    const row = findOwnedAttempt(req, res);
    if (row) res.json({ attempt: attemptFromRow(row) });
  });
  app.put('/api/attempts/:id', requireAuth, (req, res) => {
    const row = findOwnedAttempt(req, res);
    if (!row) return;
    if (row.status !== 'in_progress') return res.status(409).json({ error: 'This attempt has already been submitted.' });
    const answers = parseObject(req.body?.answers);
    const writing = parseObject(req.body?.writing);
    const notes = typeof req.body?.notes === 'string' ? req.body.notes : '';
    const remaining = req.body?.remainingSeconds;
    if (!answers || !writing) return res.status(400).json({ error: 'Answers and writing must be JSON objects under 70 KB.' });
    if (notes.length > 20000) return res.status(400).json({ error: 'Notes must be 20,000 characters or fewer.' });
    if (!Number.isInteger(remaining) || remaining < 0 || remaining > DURATIONS[row.skill]) return res.status(400).json({ error: 'Remaining time is invalid.' });
    db.prepare("UPDATE attempts SET answers_json=?,writing_json=?,notes=?,remaining_seconds=?,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id=? AND user_id=? AND status='in_progress'")
      .run(JSON.stringify(answers), JSON.stringify(writing), notes, remaining, row.id, req.session.userId);
    res.json({ attempt: attemptFromRow(db.prepare('SELECT * FROM attempts WHERE id = ?').get(row.id)) });
  });
  app.post('/api/attempts/:id/submit', requireAuth, (req, res) => {
    const row = findOwnedAttempt(req, res);
    if (!row) return;
    if (row.status === 'submitted') return res.json({ attempt: attemptFromRow(row) });
    const answers = parseObject(req.body?.answers) || JSON.parse(row.answers_json || '{}');
    const writing = parseObject(req.body?.writing) || JSON.parse(row.writing_json || '{}');
    const notes = typeof req.body?.notes === 'string' ? req.body.notes.slice(0, 20000) : row.notes;
    const remaining = Number.isInteger(req.body?.remainingSeconds) && req.body.remainingSeconds >= 0 && req.body.remainingSeconds <= DURATIONS[row.skill] ? req.body.remainingSeconds : row.remaining_seconds;
    const result = scoreAnswers(row.skill, answers);
    const resultJson = result ? JSON.stringify(result) : JSON.stringify({ skill: row.skill, completed: true, scoringNotice: 'Writing and Speaking require human review; no automatic band score is provided.' });
    db.prepare("UPDATE attempts SET status='submitted',answers_json=?,writing_json=?,notes=?,remaining_seconds=?,result_json=?,submitted_at=strftime('%Y-%m-%dT%H:%M:%fZ','now'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id=? AND user_id=? AND status='in_progress'")
      .run(JSON.stringify(answers), JSON.stringify(writing), notes, remaining, resultJson, row.id, req.session.userId);
    res.json({ attempt: attemptFromRow(db.prepare('SELECT * FROM attempts WHERE id = ?').get(row.id)) });
  });

  app.get('/', (_req, res) => res.sendFile(staticFile));
  app.get('/favicon.ico', (_req, res) => res.status(204).end());
  app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found.' }));
  app.use((error, _req, res, _next) => {
    if (res.headersSent) return;
    if (error?.type === 'entity.too.large') return res.status(413).json({ error: 'Request is too large.' });
    if (error instanceof SyntaxError && 'body' in error) return res.status(400).json({ error: 'Request body must be valid JSON.' });
    console.error(error);
    res.status(500).json({ error: 'An unexpected server error occurred.' });
  });
  return app;
}

module.exports = { createApp, DURATIONS, safeUser, attemptFromRow };
