
import { IconButton, Text } from "@/components/ui";

export type StepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Used for accessibility labels, e.g. "participants". */
  unit: string;
};

export function Stepper({ value, onChange, min = 1, max = 10, unit }: StepperProps) {
  return (
    <div className="flex-row items-center gap-4">
      <IconButton
        icon="remove"
        variant="secondary"
        aria-label={`Fewer ${unit}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      />
      <Text variant="title" className="min-w-10 text-center" aria-label={`${value} ${unit}`}>
        {value}
      </Text>
      <IconButton
        icon="add"
        variant="secondary"
        aria-label={`More ${unit}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      />
    </div>
  );
}
