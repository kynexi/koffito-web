import type { ColorToken } from "@/theme/tokens";
import { icons, type IconName } from "./icons";

export type { IconName };

export type IconProps = {
  name: IconName;
  size?: number;
  /** A design token name (e.g. "primary") or any raw color. */
  color?: ColorToken | (string & {});
  className?: string;
};

const tokenNames = new Set([
  "background", "surface", "surface-muted", "primary", "primary-pressed", "on-primary",
  "secondary", "on-secondary", "accent", "foreground", "muted", "border", "success",
  "success-soft", "warning", "warning-soft", "error", "error-soft", "overlay",
]);

/** Rounded Ionicons glyph colored with Koffito tokens. */
export function Icon({ name, size = 20, color = "foreground", className }: IconProps) {
  const Glyph = icons[name];
  const resolved = tokenNames.has(color) ? `rgb(var(--color-${color}))` : color;

  // The app renders Ionicons as a font glyph, whose line box is a little taller than the icon
  // (e.g. 20 -> 21.7px, 28 -> 30.3px). Matching that box keeps every row the same height.
  return (
    <span
      aria-hidden
      className={className}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: size, height: glyphBox(size) }}>
      <Glyph size={size} color={resolved} />
    </span>
  );
}

/** Line-box height of an Ionicons glyph at this font size (measured in the original app). */
function glyphBox(size: number) {
  return Math.round(((size * 15) / 14 + 0.36) * 100) / 100;
}
