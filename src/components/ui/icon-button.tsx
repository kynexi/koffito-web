import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";
import type { ColorToken } from "@/theme/tokens";
import { Icon, type IconName } from "./icon";

export type IconButtonVariant = "primary" | "secondary" | "surface" | "ghost";
export type IconButtonSize = "sm" | "md" | "lg";

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  icon: IconName;
  /** Required: icon-only buttons need a spoken label. */
  "aria-label": string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
};

const variantStyles: Record<IconButtonVariant, { base: string; pressed: string; color: ColorToken }> = {
  primary: { base: "bg-primary", pressed: "group-active:bg-primary-pressed", color: "on-primary" },
  secondary: { base: "bg-secondary", pressed: "group-active:bg-secondary/80", color: "on-secondary" },
  surface: { base: "bg-surface shadow-soft", pressed: "group-active:bg-surface-muted", color: "foreground" },
  ghost: { base: "bg-transparent", pressed: "group-active:bg-primary/10", color: "foreground" },
};

const sizeStyles: Record<IconButtonSize, { box: string; icon: number }> = {
  sm: { box: "h-9 w-9", icon: 18 },
  md: { box: "h-11 w-11", icon: 22 },
  lg: { box: "h-14 w-14", icon: 26 },
};

export function IconButton({
  icon,
  variant = "surface",
  size = "md",
  disabled,
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  const styles = variantStyles[variant];

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "group press-scale self-start [--press-scale:0.92]",
        // Small buttons still get a 44px touch target.
        size === "sm" && "before:absolute before:-inset-1 before:content-['']",
        disabled && "opacity-50",
      )}
      {...rest}>
      <div
        className={cn(
          "items-center justify-center rounded-full transition-colors",
          sizeStyles[size].box,
          styles.base,
          !disabled && styles.pressed,
          className,
        )}>
        <Icon name={icon} size={sizeStyles[size].icon} color={styles.color} />
      </div>
    </button>
  );
}
