/** @type {import('tailwindcss').Config} */
import animate from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";

// Color values live in src/index.css as CSS variables (light + dark), the same
// tokens as src/theme/tokens.ts, so every color switches with the system scheme.
const colorTokens = [
  "background",
  "surface",
  "surface-muted",
  "primary",
  "primary-pressed",
  "on-primary",
  "secondary",
  "on-secondary",
  "accent",
  "foreground",
  "muted",
  "border",
  "success",
  "success-soft",
  "warning",
  "warning-soft",
  "error",
  "error-soft",
  "overlay",
];

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: Object.fromEntries(
        colorTokens.map((token) => [token, `rgb(var(--color-${token}) / <alpha-value>)`]),
      ),
      borderRadius: {
        sheet: "32px",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        raised: "var(--shadow-raised)",
      },
    },
  },
  plugins: [
    animate,
    // Nunito weights as single classes, matching the app's `font-body`, `font-heading`, … names.
    plugin(({ addUtilities }) => {
      addUtilities({
        ".font-body": { fontFamily: "Nunito, system-ui, sans-serif", fontWeight: "400" },
        ".font-body-medium": { fontFamily: "Nunito, system-ui, sans-serif", fontWeight: "600" },
        ".font-body-bold": { fontFamily: "Nunito, system-ui, sans-serif", fontWeight: "700" },
        ".font-heading": { fontFamily: "Nunito, system-ui, sans-serif", fontWeight: "800" },
      });
    }),
  ],
};
