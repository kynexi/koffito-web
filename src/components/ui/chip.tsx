import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./icon";
import { Text } from "./text";

export type ChipSize = "sm" | "md";

export type ChipProps = {
  label: string;
  emoji?: string;
  icon?: IconName;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: ChipSize;
  className?: string;
};

const sizeClasses: Record<ChipSize, { container: string; text: string; icon: number }> = {
  sm: { container: "min-h-8 px-3 gap-1", text: "text-[13px]", icon: 14 },
  md: { container: "min-h-11 px-4 gap-1.5", text: "text-[15px]", icon: 16 },
};

export function Chip({
  label,
  emoji,
  icon,
  selected = false,
  onClick,
  disabled = false,
  size = "md",
  className,
}: ChipProps) {
  const sizing = sizeClasses[size];
  const isFirstRender = useRef(true);
  const [bounce, setBounce] = useState(0);

  // A small bounce whenever selection changes (not on mount).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setBounce((value) => value + 1);
  }, [selected]);

  const content = (
    <div
      className={cn(
        "flex-row items-center rounded-full",
        sizing.container,
        selected ? "bg-primary" : "bg-surface-muted",
        disabled && "opacity-50",
        className,
      )}>
      {selected && (
        <span className="flex animate-in zoom-in-0 duration-150">
          <Icon name="checkmark-circle" size={sizing.icon} color="on-primary" />
        </span>
      )}
      {emoji && <Text className={sizing.text}>{emoji}</Text>}
      {icon && <Icon name={icon} size={sizing.icon} color={selected ? "on-primary" : "foreground"} />}
      <Text variant="label" tone={selected ? "on-primary" : "default"} className={cn("font-body-medium", sizing.text)}>
        {label}
      </Text>
    </div>
  );

  // Re-keying replays the pop animation on every selection change.
  const wrapper = cn("self-start", bounce > 0 && "animate-pop");

  if (!onClick) return <div className={wrapper}>{content}</div>;

  return (
    <button
      key={bounce}
      type="button"
      role="checkbox"
      aria-checked={selected}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(wrapper, "active:opacity-80")}>
      {content}
    </button>
  );
}
