import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";
import type { ColorToken } from "@/theme/tokens";
import { Icon, type IconName } from "./icon";
import { Spinner } from "./spinner";
import { Text, type TextTone } from "./text";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "title"> & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: IconName;
  rightIcon?: IconName;
  loading?: boolean;
  fullWidth?: boolean;
};

const variantStyles: Record<ButtonVariant, { base: string; pressed: string; color: ColorToken & TextTone }> = {
  primary: { base: "bg-primary", pressed: "group-active:bg-primary-pressed", color: "on-primary" },
  secondary: { base: "bg-secondary", pressed: "group-active:bg-secondary/80", color: "on-secondary" },
  outline: { base: "border-2 border-primary/40", pressed: "group-active:bg-primary/10", color: "primary" },
  ghost: { base: "bg-transparent", pressed: "group-active:bg-primary/10", color: "primary" },
  destructive: { base: "bg-error", pressed: "group-active:bg-error/85", color: "on-primary" },
};

const sizeStyles: Record<ButtonSize, { container: string; gap: string; text: string; icon: number }> = {
  sm: { container: "min-h-11 px-4", gap: "gap-1.5", text: "text-sm", icon: 16 },
  md: { container: "min-h-[52px] px-6", gap: "gap-2", text: "text-base", icon: 18 },
  lg: { container: "min-h-[60px] px-8", gap: "gap-2.5", text: "text-lg", icon: 20 },
};

export function Button({
  title,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  loading = false,
  fullWidth = false,
  disabled,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const isDisabled = !!disabled || loading;
  const styles = variantStyles[variant];
  const sizing = sizeStyles[size];

  return (
    <button
      type={type}
      aria-label={title}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      className={cn("group press-scale", fullWidth ? "self-stretch" : "self-start", isDisabled && "opacity-50")}
      {...rest}>
      <div
        className={cn(
          "flex-row items-center justify-center rounded-full transition-colors",
          sizing.container,
          styles.base,
          !isDisabled && styles.pressed,
          className,
        )}>
        {/* Content stays in the layout while loading so the button keeps its width. */}
        <div className={cn("flex-row items-center", sizing.gap, loading && "opacity-0")}>
          {leftIcon && <Icon name={leftIcon} size={sizing.icon} color={styles.color} />}
          <Text variant="label" tone={styles.color} className={sizing.text}>
            {title}
          </Text>
          {rightIcon && <Icon name={rightIcon} size={sizing.icon} color={styles.color} />}
        </div>
        {loading && (
          <div className="absolute inset-0 items-center justify-center">
            <Spinner color={styles.color} />
          </div>
        )}
      </div>
    </button>
  );
}
