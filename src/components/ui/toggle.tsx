import { Switch } from "@/components/shadcn/switch";

export type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  /** Required: a switch on its own has no visible label. */
  "aria-label": string;
  disabled?: boolean;
};

/** Themed on/off switch in the warm palette (shadcn Switch). */
export function Toggle({ value, onValueChange, disabled, ...rest }: ToggleProps) {
  return <Switch checked={value} onCheckedChange={onValueChange} disabled={disabled} aria-label={rest["aria-label"]} />;
}
