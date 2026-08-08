# Grand Father's Ultimate Ultra Supernova Webb

A front-end-only Next.js (App Router) web app: gentle, camera-based movement
exercises for elderly users in Thailand, built around universal-design
principles (large text, high contrast, icon + label navigation, minimum
44px tap targets, visible focus rings, respects reduced-motion).

## Stack
- Next.js 14 (App Router, JavaScript)
- Tailwind CSS (custom matcha / azuki / mustard palette)
- React Context + `localStorage` for all data (no backend/database)
- `@tensorflow-models/pose-detection` (MoveNet) for camera-based movement
  matching, run entirely in the browser
- `lucide-react` icons, `next/font/google` (Kanit + Sarabun) for Thai type

## Project structure
```
src/
  app/            route pages (login, home, game, history, settings, profile)
  components/     PoseCamera, BottomNav, AvatarSVG, ConfirmDialog, ...
  context/        AppContext.js — auth + user data + settings
  lib/            storage.js (localStorage "DB"), movements.js, constants.js
public/           logo.svg, mascot.svg (original artwork, no external assets)
```

## Known limitations (by design, since this is front-end only)
- **No cross-device login.** Accounts live in this browser's `localStorage`
  only. A real "log in on any phone" feature needs a backend + database
  (e.g. Node/Express + Postgres, or a BaaS like Supabase/Firebase) to store
  users and issue sessions server-side.
- **Passwords are stored in plain text in the browser.** Fine for a local
  demo, not safe for production — a real backend must hash passwords
  (bcrypt/argon2) and never store or compare them in the client.
- **Movement scoring is a heuristic**, not clinical-grade motion analysis:
  MoveNet keypoints are compared against simple, forgiving geometric rules
  per movement (see `src/lib/movements.js`).

See the chat response for setup and free-hosting instructions in Thai.
