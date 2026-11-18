import { Children, type PropsWithChildren } from "react";

import { Card, Icon, type IconName, Text, Toggle } from "@/components/ui";

export type SettingsSectionProps = PropsWithChildren<{ title: string }>;

/** Titled card grouping `SettingsRow`s, with soft dividers between them. */
export function SettingsSection({ title, children }: SettingsSectionProps) {
  const rows = Children.toArray(children);

  return (
    <div className="gap-2">
      <Text variant="label" tone="muted" className="px-2">
        {title}
      </Text>
      <Card padding="none" className="px-4">
        {rows.map((row, index) => (
          <div key={index}>
            {index > 0 && <div className="h-px bg-border" />}
            {row}
          </div>
        ))}
      </Card>
    </div>
  );
}

export type SettingsRowProps = {
  icon: IconName;
  label: string;
  description?: string;
  /** Navigates somewhere; shows a chevron. */
  onClick?: () => void;
  /** Turns the row into a switch. */
  toggle?: { value: boolean; onChange: (value: boolean) => void };
  tone?: "default" | "error";
};

export function SettingsRow({ icon, label, description, onClick, toggle, tone = "default" }: SettingsRowProps) {
  const destructive = tone === "error";

  const content = (
    <div className="min-h-[60px] flex-row items-center gap-3 py-3">
      <div className={destructive ? "h-10 w-10 items-center justify-center rounded-full bg-error-soft" : "h-10 w-10 items-center justify-center rounded-full bg-surface-muted"}>
        <Icon name={icon} size={20} color={destructive ? "error" : "primary"} />
      </div>
      <div className="flex-1">
        <Text variant="label" tone={destructive ? "error" : "default"}>
          {label}
        </Text>
        {description && (
          <Text variant="caption" tone="muted">
            {description}
          </Text>
        )}
      </div>
      {toggle ? (
        <Toggle aria-label={label} value={toggle.value} onValueChange={toggle.onChange} />
      ) : (
        onClick && !destructive && <Icon name="chevron-forward" size={18} color="muted" />
      )}
    </div>
  );

  if (!onClick) return content;

  return (
    <button type="button" aria-label={label} onClick={onClick}>
      {content}
    </button>
  );
}
