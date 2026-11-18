
import { Icon, type IconName, Text } from "@/components/ui";

export type InfoRowProps = {
  icon: IconName;
  label: string;
  /** Makes the row tappable (e.g. open a website or dial a number). */
  onClick?: () => void;
  size?: "sm" | "md";
};

/** Icon + text line used for event facts (date, location, website, phone...). */
export function InfoRow({ icon, label, onClick, size = "md" }: InfoRowProps) {
  const small = size === "sm";

  const row = (
    <div className="flex-row items-center gap-2">
      {small ? (
        <Icon name={icon} size={15} color="muted" />
      ) : (
        <div className="h-9 w-9 items-center justify-center rounded-full bg-surface-muted">
          <Icon name={icon} size={18} color="primary" />
        </div>
      )}
      <Text variant={small ? "caption" : "body"} tone={onClick ? "primary" : small ? "muted" : "default"} numberOfLines={1} className="flex-1">
        {label}
      </Text>
    </div>
  );

  if (!onClick) return row;

  return (
    <button type="button" role="link" aria-label={label} onClick={onClick}>
      {row}
    </button>
  );
}
