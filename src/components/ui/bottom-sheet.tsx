import type { PropsWithChildren } from "react";

import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/shadcn/drawer";
import { cn } from "@/lib/cn";
import { Text } from "./text";

export type BottomSheetProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  /** Allow closing by tapping the backdrop, pressing Escape or swiping down. */
  dismissible?: boolean;
  className?: string;
}>;

/** Koffito bottom sheet, built on the shadcn Drawer (vaul): slides up, swipe down to close. */
export function BottomSheet({
  visible,
  onClose,
  title,
  description,
  dismissible = true,
  className,
  children,
}: BottomSheetProps) {
  return (
    <Drawer
      open={visible}
      dismissible={dismissible}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}>
      <DrawerContent
        aria-describedby={description ? undefined : undefined}
        className={cn("max-w-xl overflow-y-auto", className)}>
        {title || description ? (
          <div className="mb-4 gap-1">
            {title && (
              <DrawerTitle asChild>
                <Text variant="title">{title}</Text>
              </DrawerTitle>
            )}
            {description && (
              <DrawerDescription asChild>
                <Text tone="muted">{description}</Text>
              </DrawerDescription>
            )}
          </div>
        ) : (
          <DrawerTitle className="sr-only">Sheet</DrawerTitle>
        )}
        {children}
      </DrawerContent>
    </Drawer>
  );
}
