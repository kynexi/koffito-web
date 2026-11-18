import type { HTMLAttributes, Ref } from "react";

import { cn } from "@/lib/cn";

export type TextVariant = "display" | "title" | "heading" | "body" | "label" | "caption";
export type TextTone =
  | "default"
  | "muted"
  | "primary"
  | "on-primary"
  | "on-secondary"
  | "success"
  | "warning"
  | "error";

export type TextProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: TextVariant;
  tone?: TextTone;
  /** Truncate after this many lines (RN `numberOfLines`). */
  numberOfLines?: number;
  /** Render as a heading element for screen readers. */
  as?: "span" | "h1" | "h2" | "h3" | "p" | "label";
  htmlFor?: string;
  ref?: Ref<HTMLSpanElement>;
};

const variantClasses: Record<TextVariant, string> = {
  display: "font-heading text-[34px] leading-[40px] tracking-tight",
  title: "font-heading text-[26px] leading-[32px]",
  heading: "font-body-bold text-xl leading-7",
  body: "font-body text-base leading-6",
  label: "font-body-bold text-[15px] leading-5",
  caption: "font-body-medium text-[13px] leading-[18px]",
};

const toneClasses: Record<TextTone, string> = {
  default: "text-foreground",
  muted: "text-muted",
  primary: "text-primary",
  "on-primary": "text-on-primary",
  "on-secondary": "text-on-secondary",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
};

export function Text({
  variant = "body",
  tone = "default",
  numberOfLines,
  as: Tag = "span",
  className,
  style,
  ...rest
}: TextProps) {
  const clamp =
    numberOfLines === 1
      ? "truncate whitespace-nowrap"
      : numberOfLines
        ? "overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical]"
        : undefined;

  return (
    <Tag
      className={cn("m-0", variantClasses[variant], toneClasses[tone], clamp, className)}
      style={numberOfLines && numberOfLines > 1 ? { WebkitLineClamp: numberOfLines, ...style } : style}
      {...(rest as HTMLAttributes<HTMLElement>)}
    />
  );
}
