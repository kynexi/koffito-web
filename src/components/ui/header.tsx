import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { IconButton } from "./icon-button";
import { Text } from "./text";

export type HeaderSize = "compact" | "large";

export type HeaderProps = {
  title: string;
  subtitle?: string;
  size?: HeaderSize;
  onBack?: () => void;
  /** Action buttons on the right (e.g. IconButtons). */
  right?: ReactNode;
  /** Add the top safe-area inset (notched phones). */
  safeArea?: boolean;
  className?: string;
};

// The app sets the top inset inline, which overrides `pt-2` — so with safeArea the padding is
// exactly the inset (0 in desktop browsers, the notch height on phones).
const safeTop = "pt-[env(safe-area-inset-top)]";

export function Header({ title, subtitle, size = "compact", onBack, right, safeArea = true, className }: HeaderProps) {
  const back = onBack && <IconButton icon="chevron-back" aria-label="Go back" variant="surface" onClick={onBack} />;

  if (size === "large") {
    return (
      <header className={cn("gap-4 bg-background px-5 pb-4 pt-2", safeArea && safeTop, className)}>
        {(back || right) && (
          <div className="flex-row items-center justify-between">
            {back ?? <div />}
            <div className="flex-row items-center gap-2">{right}</div>
          </div>
        )}
        <div className="gap-1">
          <Text as="h1" variant="display">
            {title}
          </Text>
          {subtitle && <Text tone="muted">{subtitle}</Text>}
        </div>
      </header>
    );
  }

  return (
    <header className={cn("min-h-14 flex-row items-center gap-3 bg-background px-5 pb-3 pt-2", safeArea && safeTop, className)}>
      {back}
      <div className="flex-1">
        <Text as="h1" variant="heading" numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </div>
      {right && <div className="flex-row items-center gap-2">{right}</div>}
    </header>
  );
}
