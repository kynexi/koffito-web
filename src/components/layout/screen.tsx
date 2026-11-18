import type { PropsWithChildren, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type ScreenProps = PropsWithChildren<{
  /** Usually a `Header`; it handles the top safe-area inset itself. */
  header?: ReactNode;
  /** Sticky area pinned to the bottom (e.g. the main call to action). */
  footer?: ReactNode;
  /** Disable when the screen manages its own scrolling (lists, maps). */
  scroll?: boolean;
  /** Leave room for the floating tab bar on tab screens. */
  tabBarInset?: boolean;
  /** Let content run under the status bar (e.g. a hero image). */
  edgeToEdge?: boolean;
  contentClassName?: string;
}>;

/** Space taken by the floating tab bar plus some breathing room. */
const TAB_BAR_SPACE = 112;

/** Shared screen shell: warm background, safe areas and a centered column on wide screens. */
export function Screen({
  header,
  footer,
  scroll = true,
  tabBarInset = false,
  edgeToEdge = false,
  contentClassName,
  children,
}: ScreenProps) {
  const bottomSpace = tabBarInset
    ? `calc(${TAB_BAR_SPACE}px + env(safe-area-inset-bottom))`
    : footer
      ? "16px"
      : "calc(env(safe-area-inset-bottom) + 24px)";
  const content = cn("w-full max-w-xl self-center gap-6 px-5 pt-2", contentClassName);

  return (
    <main
      style={{ paddingTop: header || edgeToEdge ? 0 : "env(safe-area-inset-top)" }}
      className="flex-1 bg-background">
      {header && <div className="w-full max-w-xl self-center">{header}</div>}

      {scroll ? (
        <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar">
          <div style={{ paddingBottom: bottomSpace }} className={cn("grow", content)}>
            {children}
          </div>
        </div>
      ) : (
        <div style={{ paddingBottom: bottomSpace }} className={cn("flex-1", content)}>
          {children}
        </div>
      )}

      {footer && (
        <div
          style={{ paddingBottom: "max(env(safe-area-inset-bottom), 16px)" }}
          className="w-full max-w-xl gap-3 self-center bg-background px-5 pt-3">
          {footer}
        </div>
      )}
    </main>
  );
}
