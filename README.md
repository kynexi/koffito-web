# Koffito — web

The Koffito app in the browser: React 19 · Vite · TypeScript · Tailwind CSS 3.4 · shadcn/ui
(Dialog, Drawer, Switch on Radix + vaul) · react-router 7. It keeps the exact design of the
Expo app in [`../koffito`](../koffito) and talks only to the Koffito backend
([Koffito-Backend](https://github.com/The1Dani/Koffito-Backend), branch `feat/own-auth`), which
implements accounts, sessions and all data itself.

## Run

Start the backend first (its README has the details):

```bash
cd ../Koffito-Backend
docker compose up -d db mail
uv run python -m koffito.migrate && uv run python -m koffito.cli seed
uv run koffito                      # http://127.0.0.1:8000
```

Then the app:

```bash
npm install
npm run dev                         # http://localhost:5173 — /api is proxied to the backend
npm run build                       # static site in dist/
```

Emails (confirm your address, reset password) arrive in Mailpit: http://localhost:8025.
Make yourself an admin with `uv run python -m koffito.cli make-admin you@example.com` in the
backend folder; Settings then shows **Admin → Schedule a coffee talk / Reports**.

Set `KOFFITO_API_URL` (see `.env.example`) if the backend runs somewhere else.

## How it talks to the backend

- `src/lib/api.ts`: one `fetch` wrapper on `/api`.
  - The access token is kept in memory only. The refresh token is an httpOnly cookie the code
    never sees.
  - On `401` it refreshes once and retries. Refreshes are serialised across tabs with Web Locks.
- `src/context/session.tsx`: sign up, confirm email, sign in and out, profile (`GET /me`),
  profile, survey and settings saves.
- `src/context/events.tsx`: your coffee talks + open ones (`/me/events`, `/events`), visited
  cafés, and join / leave / reveal / attendance / rating.
- `src/lib/mappers.ts`: API shapes → the app's own types, so the components stay as they were.
- Auth screens: login, register, **check email**, **verify email**, **forgot / reset password**,
  **change password** (Settings).

Security details are in the backend's `docs/security.md`.

## How the port is organised

| Original (Expo) | Web |
| --- | --- |
| `src/app/**` (expo-router files) | `src/app/**`, same file names; routes declared in `src/app.tsx` with the same URLs |
| `Stack.Protected` guards | `<Protected>` / `<AdminOnly>` in `src/app.tsx` |
| floating tab bar (`Tabs`) | `TabsLayout` + `components/navigation/app-tab-bar.tsx` |
| `router.push / replace / back`, `useLocalSearchParams`, `<Redirect>` | `src/lib/router.tsx` (same API on react-router) |
| NativeWind classes + `KoffitoThemeProvider` CSS vars | Tailwind with the same class names; tokens as CSS variables in `src/index.css` |
| `View` / `Text` / `Pressable` / `ScrollView` | `div` / `Text` (`span`) / `button` / overflow `div` |
| React Native layout defaults | one zero-specificity rule in `src/index.css` (column flex, no shrink, `line-height: normal`) |
| Reanimated enter / press / pop animations | `tailwindcss-animate` + `.press-scale` / `.animate-pop` CSS |
| `BottomSheet` (gesture handler) | shadcn **Drawer** (vaul) — swipe down to close |
| `Modal` | shadcn **Dialog** |
| RN `Switch` | shadcn **Switch**, sized like the web build of the RN switch (40×20) |
| `@expo/vector-icons` Ionicons | `react-icons/io5` (same glyphs) in a box the size of the font glyph |

**Verification:** welcome, login, register, survey, home, events, event details, profile and
settings were measured against the original's web build at 375×812 and match it. The new
auth screens reuse the same components.
