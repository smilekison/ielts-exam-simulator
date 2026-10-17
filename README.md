# IELTS Reading Practice Simulator

A static, browser-based IELTS-style reading practice interface. It uses a split passage/questions workspace and saves answers in the current browser using localStorage.

## Run locally

Open `index.html` in a modern browser. No build step or backend is needed.

## Deploy

This is a static site. It can be hosted on GitHub Pages, Cloudflare Pages, Netlify, or any static web server. For GitHub Pages, open **Settings → Pages**, choose the `main` branch and root folder, and save.

## Current capabilities

- Two-pane reading passage and questions layout, with independently scrollable panes.
- Select multiple-choice answers and type short answers.
- Auto-save answers, notes, and remaining time in local browser storage.
- Numbered question navigation, previous/next controls, countdown timer, review and submission summary.
- Basic text highlighting and answer-option strike-through.

## Important

The reading passages and questions currently in the interface are demonstration content and should be replaced with the content supplied for the test. There is no official answer key yet, so the submission page reports completion only and does not calculate a score. Local browser storage is device/browser specific; it does not sync across browsers or devices. This is an independent IELTS-style practice tool and is not affiliated with or endorsed by IELTS.
