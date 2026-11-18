# Koffito — web

The Koffito app as a browser-first React app. It is a port of the Expo / React Native app in
[`../koffito`](../koffito) that keeps the same design: same tokens, colors (light + dark), Nunito
weights, Ionicons glyphs, spacing, radii, shadows and motion.

**Verification status:** the signed-out screens (welcome, login, register) were compared with the
original's web build at 375×812 in light and dark mode, and match to within 1px. The signed-in
screens build and type-check but have not yet been compared side by side.

**Stack:** React 19 · Vite · TypeScript · Tailwind CSS 3.4 · shadcn/ui (Dialog, Drawer, Switch on
Radix + vaul) · react-router 7 · Supabase auth.

## Run

```bash
npm install
cp .env.example .env   # VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY (public values only)
npm run dev            # http://localhost:5173
npm run build          # static site in dist/ — host on Vercel / Netlify / any static host
```

The backend (`Koffito-Backend`, branch `feature/supabase-integration`) runs separately; add this
site's origin to the backend's `CORS_ORIGINS` once the app starts calling it.

## How the port is organised

| Original (Expo) | Web |
| --- | --- |
| `src/app/**` (expo-router files) | `src/app/**`, same file names; routes declared in `src/app.tsx` with the same URLs |
| `Stack.Protected` guards | `<Protected>` in `src/app.tsx` |
| floating tab bar (`Tabs`) | `TabsLayout` + `components/navigation/app-tab-bar.tsx` |
| `router.push / replace / back`, `useLocalSearchParams`, `<Redirect>` | `src/lib/router.tsx` (same API on react-router) |
| NativeWind classes + `KoffitoThemeProvider` CSS vars | Tailwind with the same class names; tokens as CSS variables in `src/index.css` |
| `View` / `Text` / `Pressable` / `ScrollView` | `div` / `Text` (`span`) / `button` / overflow `div` |
| React Native layout defaults | one zero-specificity rule in `src/index.css` (column flex, no shrink) so the class names mean the same thing |
| Reanimated enter / press / pop animations | `tailwindcss-animate` + `.press-scale` / `.animate-pop` CSS |
| `BottomSheet` (gesture handler) | shadcn **Drawer** (vaul) — swipe down to close |
| `Modal` | shadcn **Dialog** |
| RN `Switch` | shadcn **Switch** |
| `@expo/vector-icons` Ionicons | `react-icons/io5` (same glyph set), map in `components/ui/icons.ts` |

`src/data`, `src/types`, `src/constants`, `src/context` and most of `src/lib` are copied as-is.

## Differences from the phone app

- `/` opens Home (or Welcome when signed out). The original's dev-only “start on `/dev`” setting
  was not carried over; the dev jump menu is still at `/dev`.
- Safe-area insets use CSS `env(safe-area-inset-*)`; keyboard avoidance is left to the browser.
