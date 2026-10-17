'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const scripts = [...html.matchAll(/<script\\b[^>]*>([\\s\\S]*?)<\\/script>/g)];

if (scripts.length !== 1) {
  throw new Error(`Expected one inline application script in index.html; found ${scripts.length}.`);
}

try {
  new vm.Script(scripts[0][1], { filename: 'index.html:inline-script.js' });
} catch (error) {
  console.error('The inline JavaScript in index.html is invalid.');
  throw error;
}

console.log('Inline JavaScript in index.html: syntax OK');
