# Controller Test

A browser tool for checking game controllers. Plug in a pad, press a button, and watch the buttons, sticks, and triggers update live. Resting stick offset is flagged as drift. A rumble pulse uses the Gamepad vibration actuator when the browser exposes one.

Inputs stay in the browser. Nothing is uploaded.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:5173.

```bash
npm run typecheck
npm run build
npm run preview
```

## Stack

Vite, React, TypeScript, and the Gamepad API.

## Deploy

Netlify builds with `npm run build` and publishes `dist/`. See `netlify.toml`. The site is [controller-test.app](https://controller-test.app).
