'use strict';

require('dotenv').config();
const path = require('node:path');
const fs = require('node:fs');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const { createDatabase } = require('./server/database');
const { createApp } = require('./server/app');

const dataDir = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), 'data'));
fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.resolve(process.env.DB_PATH || path.join(dataDir, 'ielts.sqlite'));
if (process.env.NODE_ENV === 'production' && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)) {
  throw new Error('SESSION_SECRET must be set to a random value of at least 32 characters in production.');
}
const db = createDatabase(dbPath);
const sessionStore = new SQLiteStore({ db: 'sessions.sqlite', dir: dataDir, concurrentDB: true });
const app = createApp({ db, sessionStore });
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';

const server = app.listen(port, host, () => {
  console.log('IELTS Practice Simulator listening on http://' + host + ':' + port);
  console.log('SQLite database: ' + dbPath);
});
function shutdown(signal) {
  console.log(signal + ' received; shutting down gracefully.');
  server.close(() => {
    sessionStore.close?.();
    db.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
