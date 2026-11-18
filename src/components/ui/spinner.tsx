import type { ColorToken } from "@/theme/tokens";

/** Small circular loading indicator (RN ActivityIndicator). */
export function Spinner({ color = "primary", size = 20 }: { color?: ColorToken; size?: number }) {
  return (
    <span
      role="progressbar"
      aria-label="Loading"
      className="inline-block animate-spin rounded-full border-2 border-r-transparent"
      style={{ width: size, height: size, borderColor: `rgb(var(--color-${color}))`, borderRightColor: "transparent" }}
    />
  );
}
