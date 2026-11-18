import { useState } from "react";

import { BottomSheet, Icon, Text } from "@/components/ui";
import { cafes } from "@/data/cafes";
import { cn } from "@/lib/cn";
import type { Cafe } from "@/types/koffito";

export type CafePickerProps = {
  value?: Cafe;
  onChange: (cafe: Cafe) => void;
  error?: string;
};

/** "Choose coffee place" field: shows the picked café and opens a sheet with the options. */
export function CafePicker({ value, onChange, error }: CafePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="gap-1.5">
      <button type="button"
        aria-label={value ? `Coffee place: ${value.name}. Tap to change` : "Choose coffee place"}
        onClick={() => setOpen(true)}
        className={cn(
          "flex-row items-center gap-3 rounded-3xl border-2 bg-surface-muted p-3",
          error ? "border-error" : "border-transparent",
        )}>
        {value ? (
          <img className="object-cover" src={value.photo} style={{ width: 72, height: 72, borderRadius: 18 }}  alt="" />
        ) : (
          <div className="h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-secondary">
            <Icon name="image-outline" size={28} color="on-secondary" />
          </div>
        )}
        <div className="flex-1 gap-0.5">
          <Text variant="label">{value ? value.name : "Choose coffee place"}</Text>
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {value ? value.address : "Pick where you'd like to meet"}
          </Text>
        </div>
        <Icon name="chevron-forward" color="muted" />
      </button>
      {error && (
        <Text variant="caption" tone="error" className="px-1">
          {error}
        </Text>
      )}

      <BottomSheet visible={open} onClose={() => setOpen(false)} title="Choose coffee place" description="Where should everyone meet?">
        <div className="flex-1 overflow-y-auto no-scrollbar gap-2 pb-6">
          {cafes.map((cafe) => {
            const active = cafe.id === value?.id;

            return (
              <button type="button"
                key={cafe.id}
                role="radio"
                aria-checked={active}
                onClick={() => {
                  onChange(cafe);
                  setOpen(false);
                }}
                className={cn(
                  "flex-row items-center gap-3 rounded-3xl border-2 p-2.5",
                  active ? "border-primary bg-secondary" : "border-transparent bg-surface-muted",
                )}>
                <img className="object-cover" src={cafe.photo} style={{ width: 56, height: 56, borderRadius: 16 }}  alt="" />
                <div className="flex-1">
                  <Text variant="label" tone={active ? "on-secondary" : "default"}>
                    {cafe.name}
                  </Text>
                  <Text variant="caption" tone={active ? "on-secondary" : "muted"} numberOfLines={1}>
                    {cafe.address}
                  </Text>
                </div>
                <div className="flex-row items-center gap-1 pr-1">
                  <Icon name="star" size={13} color="warning" />
                  <Text variant="caption" tone={active ? "on-secondary" : "muted"}>
                    {cafe.rating.toFixed(1)}
                  </Text>
                </div>
              </button>
            );
          })}
        </div>
      </BottomSheet>
    </div>
  );
}
