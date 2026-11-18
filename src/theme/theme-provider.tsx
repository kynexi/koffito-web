import { useSyncExternalStore } from "react";

import { type ColorScheme, palette, shadows } from "./tokens";

const query = "(prefers-color-scheme: dark)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Colors and shadows are CSS variables (see index.css) that follow the system scheme,
 * so most components never need this. It exists for the few spots that need raw values.
 */
export function useKoffitoTheme() {
  const scheme: ColorScheme = useSyncExternalStore(
    subscribe,
    () => (window.matchMedia(query).matches ? "dark" : "light"),
    () => "light",
  );

  return { scheme, colors: palette[scheme], shadows: shadows[scheme] };
}
