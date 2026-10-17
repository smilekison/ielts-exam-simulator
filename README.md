# IELTS Computer-Based Practice Simulator

A static, browser-based practice simulator for Listening, Reading, Writing and Speaking. Built with HTML, CSS and JavaScript; no application backend is required.

## Skills

- **Listening:** 4 parts and 40 questions, a 30-minute timer, answer fields, multiple choice, and browser speech-synthesis playback. Dialogue playback separates speaker turns where the browser supports it.
- **Reading:** 3 passages and 40 questions, a 60-minute timer, split passage/question panels, independent scrolling, text entry, multiple choice, question navigation, highlighting and strike-through tools.
- **Writing:** Task 1 letter and Task 2 essay prompts, a 60-minute timer, saved drafts and live word counts.
- **Speaking:** 3 practice parts, cue-card prompts, a one-minute preparation timer and two-minute speaking timer for Part 2, self-review notes, and optional microphone recording/playback.

## Answers and scoring

Listening and Reading use a built-in answer key for the supplied original practice questions. At submission, the simulator reports answered questions, correct answers, completion and a **rough practice band estimate**. This is not an official IELTS score; typed answers are checked against accepted variants and spelling/wording can affect results.

Writing and Speaking are not automatically band-scored. The simulator does not claim to provide an official assessment.

## Saving data

Answers, notes, remaining time and writing drafts save automatically to `localStorage` in the current browser. Data does not sync across devices. Speaking recordings are kept as temporary browser-session media and are not uploaded to a server; they may not survive a refresh.

## Run locally

Open `index.html` in a modern browser. Microphone recording generally requires localhost or HTTPS and permission from the browser. Listening playback requires browser speech synthesis.

## Browser smoke tests

A Playwright smoke test is included in `tests/smoke.mjs`. The GitHub Actions workflow in `.github/workflows/simulator-browser-checks.yml` installs Chromium, serves the static site, and checks question counts/navigation, answer persistence, score display, Writing task switching, Speaking part transitions, and uncaught browser errors.

## Deploy

This is a static site and can be hosted on GitHub Pages, Cloudflare Pages, Netlify, or any static web server. For GitHub Pages, open **Settings → Pages**, select the `main` branch and root folder, and save.

## Branding and content

This is an independent IELTS-style practice tool with original demonstration content. It is inspired by computer-delivered language tests but is not an exact copy of a proprietary British Council/IELTS interface and is not affiliated with or endorsed by IELTS or the British Council.
