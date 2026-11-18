import type { CSSProperties, HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/cn";

export type CardVariant = "elevated" | "filled" | "outlined";
export type CardPadding = "none" | "sm" | "md" | "lg";

export type CardProps = PropsWithChildren<
  Omit<HTMLAttributes<HTMLDivElement>, "onClick"> & {
    variant?: CardVariant;
    padding?: CardPadding;
    onClick?: () => void;
    /** Fade + rise in when the card mounts. Pass a number to stagger (index in a list). */
    animateIn?: boolean | number;
  }
>;

const variantClasses: Record<CardVariant, string> = {
  elevated: "bg-surface shadow-soft",
  filled: "bg-surface-muted",
  outlined: "bg-surface border border-border",
};

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  variant = "elevated",
  padding = "md",
  onClick,
  animateIn = false,
  className,
  children,
  ...rest
}: CardProps) {
  const enter =
    animateIn === false ? undefined : "animate-in fade-in slide-in-from-bottom-[25px] fill-mode-both duration-[220ms]";
  const enterStyle: CSSProperties | undefined =
    typeof animateIn === "number" ? { animationDelay: `${animateIn * 60}ms` } : undefined;

  const surface = (
    <div className={cn("rounded-3xl", variantClasses[variant], paddingClasses[padding], className)} {...rest}>
      {children}
    </div>
  );

  return (
    <div className={enter} style={enterStyle}>
      {onClick ? (
        // Not a <button>: pressable cards contain their own buttons (e.g. "Yes" / "No"),
        // and clicks on those must not also open the card.
        <div
          role="button"
          tabIndex={0}
          className="press-scale cursor-pointer [--press-scale:0.98] has-[button:active]:transform-none"
          onClick={(event) => {
            if (fromNestedControl(event.target, event.currentTarget)) return;
            onClick();
          }}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onClick();
            }
          }}>
          {surface}
        </div>
      ) : (
        surface
      )}
    </div>
  );
}

/** True when the click started on a button/link/input inside the card rather than the card itself. */
function fromNestedControl(target: EventTarget, card: Element) {
  const control = (target as Element).closest?.("button, a, input, textarea, select, [role='button'], [role='switch']");
  return !!control && control !== card;
}
