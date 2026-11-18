import type { PropsWithChildren } from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/shadcn/dialog";
import { cn } from "@/lib/cn";
import { Button, type ButtonProps } from "./button";
import { Icon, type IconName } from "./icon";
import { Text } from "./text";

type ModalAction = Omit<ButtonProps, "fullWidth" | "size">;

export type ModalProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  emoji?: string;
  icon?: IconName;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  /** Allow closing by clicking the backdrop or pressing Escape. */
  dismissible?: boolean;
  className?: string;
}>;

/** Centered Koffito dialog card (shadcn Dialog underneath): soft fade + slight scale-up. */
export function Modal({
  visible,
  onClose,
  title,
  description,
  emoji,
  icon,
  primaryAction,
  secondaryAction,
  dismissible = true,
  className,
  children,
}: ModalProps) {
  const block = (event: Event) => {
    if (!dismissible) event.preventDefault();
  };

  return (
    <Dialog
      open={visible}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}>
      <DialogContent
        className="max-w-sm"
        onEscapeKeyDown={block}
        onPointerDownOutside={block}
        onInteractOutside={block}
        aria-describedby={description ? undefined : undefined}>
        <div className={cn("items-center gap-5 rounded-[32px] bg-surface p-6 shadow-raised", className)}>
          {(emoji || icon) && (
            <div className="h-16 w-16 items-center justify-center rounded-full bg-secondary">
              {emoji ? (
                <Text className="text-3xl leading-10">{emoji}</Text>
              ) : (
                icon && <Icon name={icon} size={28} color="on-secondary" />
              )}
            </div>
          )}

          <div className="items-center gap-1.5">
            <DialogTitle asChild>
              <Text as="h2" variant="title" className="text-center">
                {title}
              </Text>
            </DialogTitle>
            {description && (
              <DialogDescription asChild>
                <Text tone="muted" className="text-center">
                  {description}
                </Text>
              </DialogDescription>
            )}
          </div>

          {children}

          {(primaryAction || secondaryAction) && (
            <div className="gap-2 self-stretch">
              {primaryAction && <Button fullWidth {...primaryAction} />}
              {secondaryAction && <Button variant="ghost" fullWidth {...secondaryAction} />}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
