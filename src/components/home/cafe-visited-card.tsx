
import { Card, Icon, Text } from "@/components/ui";
import type { Cafe } from "@/types/koffito";

export type CafeVisitedCardProps = {
  cafe: Cafe;
  onClick?: () => void;
};

/** Compact picture card for the "Cafés you've visited" rail. */
export function CafeVisitedCard({ cafe, onClick }: CafeVisitedCardProps) {
  return (
    <Card padding="none" onClick={onClick} className="w-44 overflow-hidden">
      <img className="object-cover"
        src={cafe.photo}
        alt={`Photo of ${cafe.name}`}
        style={{ width: "100%", height: 104 }}
       />
      <div className="gap-1 p-3">
        <Text variant="label" numberOfLines={1}>
          {cafe.name}
        </Text>
        <div className="flex-row items-center gap-1">
          <Icon name="star" size={13} color="warning" />
          <Text variant="caption" tone="muted">
            {cafe.rating.toFixed(1)}
          </Text>
        </div>
      </div>
    </Card>
  );
}
