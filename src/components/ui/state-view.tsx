import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Text } from "./text";

export type StateViewProps = {
  /** Omit or pass "" to drop the circle entirely. */
  emoji?: string;
  title: string;
  description?: string;
  /** Background for the emoji circle. */
  circleClassName: string;
  action?: ReactNode;
  className?: string;
};

/** Shared friendly layout for EmptyState and ErrorState. */
export function StateView({ emoji, title, description, circleClassName, action, className }: StateViewProps) {
  return (
    <div className={cn("items-center justify-center gap-5 px-8 py-10 animate-in fade-in duration-300", className)}>
      {emoji ? (
        <div className={cn("h-24 w-24 items-center justify-center rounded-full", circleClassName)}>
          <Text className="text-[44px] leading-[54px]">{emoji}</Text>
        </div>
      ) : null}
      <div className="max-w-xs items-center gap-1.5">
        <Text variant="title" className="text-center">
          {title}
        </Text>
        {description && (
          <Text tone="muted" className="text-center">
            {description}
          </Text>
        )}
      </div>
      {action}
    </div>
  );
}
