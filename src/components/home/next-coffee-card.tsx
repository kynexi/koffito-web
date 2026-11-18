
import { AvatarGroup, Badge, Card, Icon, Text } from "@/components/ui";
import { getCafeLabel, isLocationHidden } from "@/data/events";
import { toAvatarPeople } from "@/data/users";
import { formatDateTime, formatRelativeDay } from "@/lib/date";
import type { CoffeeEvent } from "@/types/koffito";

export type NextCoffeeCardProps = {
  event: CoffeeEvent;
  onClick: () => void;
};

/** Highlight card for the closest upcoming coffee talk. */
export function NextCoffeeCard({ event, onClick }: NextCoffeeCardProps) {
  return (
    <Card onClick={onClick} animateIn className="gap-3 bg-secondary">
      <div className="flex-row items-center justify-between">
        <Text variant="label" tone="on-secondary">
          Your next coffee talk
        </Text>
        <Badge label={formatRelativeDay(event.date)} variant="primary" icon="time-outline" />
      </div>

      <div className="gap-1">
        <Text variant="heading" tone="on-secondary">
          {getCafeLabel(event)}
        </Text>
        <Text variant="caption" tone="on-secondary">
          {formatDateTime(event.date)}
        </Text>
      </div>

      <div className="flex-row items-center justify-between">
        {/* Faces stay hidden until the café is revealed. */}
        {isLocationHidden(event) ? <div /> : <AvatarGroup people={toAvatarPeople(event.participants)} size="sm" />}
        <Icon name="arrow-forward-circle" size={28} color="primary" />
      </div>
    </Card>
  );
}
