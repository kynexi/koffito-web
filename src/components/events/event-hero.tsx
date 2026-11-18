import type { ReactNode } from "react";

import { IconButton } from "@/components/ui";

export type EventHeroProps = {
  photo: string;
  /** Blur the picture for surprise cafés. */
  hidden?: boolean;
  onBack: () => void;
  /** Buttons on the top right. */
  actions?: ReactNode;
  /** Centered overlay, e.g. the reveal countdown. */
  children?: ReactNode;
  "aria-label": string;
};

const HERO_HEIGHT = 300;

/** Full-bleed café picture with floating back/action buttons. */
export function EventHero({ photo, hidden = false, onBack, actions, children, "aria-label": label }: EventHeroProps) {
  return (
    <div style={{ height: HERO_HEIGHT }} className="overflow-hidden rounded-b-sheet bg-surface-muted">
      <img className="object-cover"
        src={photo}
        alt={label}
        style={{ width: "100%", height: "100%", filter: hidden ? "blur(60px)" : undefined }}
      />

      {children && <div className="absolute inset-0 items-center justify-center">{children}</div>}

      <div className="absolute inset-x-5 top-[calc(env(safe-area-inset-top)+8px)] flex-row items-center justify-between">
        <IconButton icon="chevron-back" aria-label="Go back" onClick={onBack} />
        <div className="flex-row gap-2">{actions}</div>
      </div>
    </div>
  );
}
