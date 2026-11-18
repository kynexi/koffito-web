import type { PropsWithChildren } from "react";

import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";

export type SectionProps = PropsWithChildren<{
  title: string;
  description?: string;
  /** Small text action on the right, e.g. "See all". */
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}>;

export function Section({ title, description, actionLabel, onAction, className, children }: SectionProps) {
  return (
    <div className={cn("gap-3", className)}>
      <div className="flex-row items-end justify-between gap-3">
        <div className="flex-1 gap-0.5">
          <Text variant="heading">
            {title}
          </Text>
          {description && (
            <Text variant="caption" tone="muted">
              {description}
            </Text>
          )}
        </div>
        {actionLabel && onAction && (
          <button type="button" onClick={onAction}>
            <Text variant="label" tone="primary">
              {actionLabel}
            </Text>
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
