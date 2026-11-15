# Controller Test

A free browser tester for game controllers at [controller-test.app](https://controller-test.app). Plug in a pad, press a button, and the page shows that model with live buttons, sticks, triggers, and rumble.

Inputs stay in the browser. Nothing is uploaded.

## What it checks

- **Picture of the pad.** Xbox, PlayStation, Nintendo, Steam, and common third-party controllers. Pressed buttons and stick directions light up on the diagram.
- **Sticks.** Each stick shows position, a short trail, and a centered or drifting badge.
- **Circularity.** Spin a stick around the rim. The plot fills in slices and reports how far the path sits from a circle.
- **Drift.** Rest both sticks for 5 seconds. The result is none, slight, or drifting, with a suggested deadzone. Moving a stick during the test cancels that side.
- **Buttons and axes.** A running history of presses, the full button list, and the raw axis values.
- **Rumble.** A short pulse of the strong and weak motors when the browser exposes them.

If the detected name is wrong, **Change controller** picks the model. The picture and description change. The live inputs do not.

## What the browser cannot see

The number under the controller name is how often this page notices a new snapshot. It is capped by the display refresh. It is not the controller's USB or Bluetooth rate, and it is not input lag.

On Windows, Chrome and Edge often report every Xbox pad as a generic XInput controller, including an Elite. The real model is still selectable. Elite back paddles are not extra Gamepad buttons.

Firefox can read the pad. It cannot rumble. Chrome or Edge can.

A browser also hides the controller until it sends a button, bumper, or stick input. Plugging it in is not enough.

## Getting started

Requires Node.js 20 or newer. Netlify uses Node.js 22.

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run build      # typecheck, then write dist/
npm run preview    # serve dist/
```

## How it's built

Vite, React 19, TypeScript, and React Router. The Gamepad API is polled from a `requestAnimationFrame` loop in `src/gamepad/useGamepad.ts`. Controller names come from `src/gamepad/known_gamepads.txt`.

`/privacy` is a real page. `/test` and `/about` redirect home. The production build copies `index.html` to `404.html`, and `netlify.toml` also sends unknown paths back to `index.html` with a 200 so client-side routes stay valid.

## Project layout

```
src/
  components/        tester, nav, footer
  components/art/    controller diagrams
  gamepad/           polling, identification, drift, circularity, rumble
  pages/             privacy
  styles/
  assets/controllers/  SVG art and third-party licenses
```

## Deployment

`netlify.toml` builds with `npm run build` and publishes `dist/`. Hashed files in `/assets/*` are cached for a year. The site is [controller-test.app](https://controller-test.app).

## Controller art

Diagrams are from the [Gamepad Asset Pack](https://github.com/AL2009man/Gamepad-Asset-Pack) (MIT). The small `icon-*.svg` files are from [Controllercons](https://controllercons.github.io/) (SIL Open Font License). Both licenses are in `src/assets/controllers/`.

## Support

[![Buy Me a Coffee](https://storage.ko-fi.com/cdn/kofi5.png)](https://ko-fi.com/V7V01A0SJC)

## Contributing

Issues and pull requests are welcome. Run `npm run typecheck` and `npm run build` before opening a PR.

## License

MIT. See [LICENSE](LICENSE).
