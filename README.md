# IELTS Computer-Based Practice Simulator

A static browser-based practice simulator covering Listening, Reading, Writing and Speaking. It is built with HTML, CSS and JavaScript and requires no backend or build step.

## Run locally
Open `index.html` in a modern browser. For microphone recording in Speaking, use localhost or an HTTPS deployment and grant microphone permission.

## Skills
- **Listening:** four sample parts, 40 sample questions, timed playback via browser speech synthesis, multiple-choice and typed answers.
- **Reading:** three sample passages with interactive question inputs and separate passage/question panes.
- **Writing:** Task 1 letter and Task 2 essay prompts, timed writing, autosaved responses and live word counts.
- **Speaking:** three practice parts, cue card prompts, self-review notes, and optional microphone recording/playback when the browser supports it.

## Saving and limitations
Answers, notes and writing drafts are saved in the current browser using localStorage. They do not sync between devices. Speaking recordings are held in the current browser session and are not uploaded to a server. A browser refresh may lose the speaking recording.

This is an initial functional prototype. It uses original demonstration questions, not official IELTS question papers or official audio. The Listening audio is generated using browser text-to-speech. Reading currently contains 30 sample questions; the 40-question official-style reading format and complete answer key still need to be filled with a verified question set. Writing and Speaking are not automatically band-scored. Do not treat scores from this prototype as official.

The visual layout is inspired by computer-delivered English proficiency tests, but is not an exact copy of a proprietary British Council/IELTS interface and is not affiliated with or endorsed by IELTS or the British Council.

## Deploy
Host the static repository on GitHub Pages, Cloudflare Pages, Netlify, or another static web host. For GitHub Pages, open **Settings → Pages**, select the `main` branch and root folder, and save.
