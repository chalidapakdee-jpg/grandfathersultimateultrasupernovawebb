# Grandfather's Ultimate Ultra SuperNova

A responsive, front-end-only Next.js app for gentle movement exercise aimed at
elderly people in Thailand — built around the Matcha green / Azuki red / Pale
mustard yellow palette from your logo and mascot.

## Getting started

Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000 — the browser will ask for camera
permission the first time you open the game screen.

To create a production build:

```bash
npm run build
npm start
```

## What's implemented

- **Login / register** — simple username + password accounts (see
  "Limitations" below).
- **Home** — Thai welcome message from the mascot, quick stats, and
  shortcuts into the other three sections.
- **Movement game** — turns on the front camera, shows a private,
  mirrored self-view (never recorded or uploaded anywhere), speaks a
  short Thai instruction out loud every few seconds, and detects
  whether the person is moving by comparing consecutive camera frames.
  Points build up while movement is detected. You can pick a duration
  (1/3/5/10 min), pause and resume at any time, and end early — pausing
  costs a flat 5% off the final score, as requested.
- **Record (usage history)** — total points, total sessions, sessions
  in the last two weeks, last-played date, a 14-day activity chart, and
  a full session list.
- **Settings** — four font-size steps (applied app-wide, not just on
  one page), log out, delete usage history, delete account.
- **Profile** — a Duolingo-style avatar builder (body, hair, face,
  outfit, accessories) where extra options cost points and starter
  options are free, plus a leaderboard ranking every account by total
  points (0–3,000,000 range, as specified).
- Large tap targets, big readable type, icon + label navigation, and
  strong focus outlines throughout, per the universal design brief.

## Important limitations (because this is front-end only)

- **Accounts live in the browser that created them**, in
  `localStorage` — they do **not** sync between an iPhone, an Android
  phone, and a desktop the way the brief describes, since there's no
  server. `lib/storage.js` isolates every bit of this logic behind
  small functions (`getUsers`, `login`, `getUserData`, ...) specifically
  so that swapping in a real backend (e.g. Supabase, Firebase Auth, or
  your own API) later means editing that one file, not the rest of the
  app.
- **Passwords are stored in plain text** in `localStorage` for this
  demo. Do not reuse a real password when testing, and treat this as a
  placeholder for real authentication before any real deployment.
- **Movement detection is a lightweight on-device motion algorithm**
  (frame-differencing on a downscaled camera image), not a trained
  pose-recognition AI model — it reliably tells "moving" from "still,"
  but it doesn't verify *which* exercise was performed. For true
  AI pose-matching (e.g. confirming an arm is actually raised), the
  natural next step is `@tensorflow-models/pose-detection` with the
  MoveNet model; the camera/canvas plumbing in
  `components/CameraMovementGame.js` is already structured so that
  swap is localized to the sampling function.
- **Thai voice cues** use the browser's built-in Web Speech API
  (`speechSynthesis`), so quality/availability depends on the device —
  most modern Chrome, Edge, and Android builds include a Thai voice;
  some older browsers may not.
- **Leaderboard rivals are mock data** (`lib/mockLeaderboard.js`);
  only your own row is live/real.

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` builds the app as a static export and
publishes it to GitHub Pages on every push to `main` (or manually from
the Actions tab). `next.config.js` automatically figures out the right
`/<repo-name>` base path from GitHub's own `GITHUB_REPOSITORY`
environment variable, so no repo name needs to be hardcoded anywhere.

Your Pages URL will be:
- `https://<your-github-username>.github.io/<repo-name>/` for a normal
  project repo, or
- `https://<your-github-username>.github.io/` if the repo itself is
  named `<your-github-username>.github.io`.

See the setup checklist in the chat response for the one-time manual
steps (pushing this code and confirming the Pages source setting).

## Project structure

```
app/            Next.js App Router pages (one folder per screen)
components/     Reusable UI + the two data providers (Auth, UserData)
lib/            Pure helpers: storage, Thai speech, movement prompts,
                avatar catalog, mock leaderboard
public/images/  Your logo and mascot
```
