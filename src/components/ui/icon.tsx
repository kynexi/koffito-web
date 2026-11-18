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

  return <Glyph aria-hidden size={size} color={resolved} className={className} style={{ flexShrink: 0 }} />;
}
