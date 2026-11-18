import { useState } from "react";

import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./icon";
import { Text } from "./text";

export type TabBarItem = {
  key: string;
  /** Used for accessibility; tabs are icon-only. */
  label: string;
  icon: IconName;
  activeIcon?: IconName;
  /** Small count bubble; `true` shows a dot. */
  badge?: number | boolean;
};

export type TabBarProps = {
  items: TabBarItem[];
  activeKey: string;
  onChange: (key: string) => void;
  /** Add the bottom safe-area inset. */
  safeArea?: boolean;
  className?: string;
};

/** Floating pill tab bar. Icon-only; the pressed icon pops. */
export function TabBar({ items, activeKey, onChange, safeArea = true, className }: TabBarProps) {
  return (
    <div className={cn("px-5 pt-5", safeArea ? "pb-[max(env(safe-area-inset-bottom),14px)]" : "pb-0", className)}>
      <div role="tablist" className="flex-row items-center justify-between gap-4 rounded-full bg-surface p-2 shadow-raised">
        {items.map((item) => (
          <TabBarButton
            key={item.key}
            item={item}
            active={item.key === activeKey}
            onClick={() => onChange(item.key)}
          />
        ))}
      </div>
    </div>
  );
}

function TabBarButton({ item, active, onClick }: { item: TabBarItem; active: boolean; onClick: () => void }) {
  // Bumping the key replays the pop: icon grows, then springs back to its original size.
  const [pops, setPops] = useState(0);

  return (
    <button
      type="button"
      role="tab"
      aria-label={item.label}
      aria-selected={active}
      onClick={() => {
        setPops((value) => value + 1);
        onClick();
      }}
      className="flex-1 items-center">
      <div className={cn("h-12 w-12 items-center justify-center rounded-full transition-colors", active && "bg-primary")}>
        <div key={pops} className={cn(pops > 0 && "animate-pop [--pop-scale:1.25]")}>
          <Icon
            name={active ? (item.activeIcon ?? item.icon) : item.icon}
            size={22}
            color={active ? "on-primary" : "muted"}
          />
          {item.badge ? <TabBadge value={item.badge} /> : null}
        </div>
      </div>
    </button>
  );
}

function TabBadge({ value }: { value: number | boolean }) {
  if (value === true) {
    return <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent" />;
  }

  return (
    <div className="absolute -right-2 -top-1.5 min-w-[18px] items-center rounded-full border-2 border-surface bg-accent px-1">
      <Text className="font-body-bold text-[10px] leading-[14px] text-on-primary">
        {Number(value) > 99 ? "99+" : value}
      </Text>
    </div>
  );
}
