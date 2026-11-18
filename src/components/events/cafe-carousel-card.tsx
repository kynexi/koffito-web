
import { AvatarGroup, Button, Card, Text } from "@/components/ui";
import { toAvatarPeople } from "@/data/users";
import { formatDateTime } from "@/lib/date";
import type { CoffeeEvent } from "@/types/koffito";

import { InfoRow } from "./info-row";

export type CafeCarouselCardProps = {
  event: CoffeeEvent;
  width: number;
  onClick: () => void;
  onJoin: () => void;
};

/** Swipeable card over the map: café picture, blurb and "Join meeting". */
export function CafeCarouselCard({ event, width, onClick, onJoin }: CafeCarouselCardProps) {
  const spotsLeft = event.maxParticipants - event.participants.length;

  return (
    <div style={{ width }}>
      <Card padding="none" className="overflow-hidden">
        {/* Only the café summary opens details, so the join button isn't nested in another button. */}
        <button type="button" aria-label={`View ${event.cafe.name}`} onClick={onClick}>
          <img className="object-cover"
            src={event.cafe.photo}
            alt={`Photo of ${event.cafe.name}`}
            style={{ width: "100%", height: 120 }}
           />
          <div className="gap-2 px-4 pt-4">
            <div className="flex-row items-center justify-between gap-2">
              <Text variant="heading" numberOfLines={1} className="flex-1">
                {event.cafe.name}
              </Text>
              <AvatarGroup people={toAvatarPeople(event.participants)} size="xs" />
            </div>
            <Text variant="caption" tone="muted" numberOfLines={2}>
              {event.cafe.description}
            </Text>
            <InfoRow
              size="sm"
              icon="calendar-outline"
              label={`${formatDateTime(event.date)} · ${spotsLeft} spot(s) left`}
            />
          </div>
        </button>
        <div className="p-4 pt-3">
          <Button title="Join meeting" leftIcon="cafe" fullWidth disabled={spotsLeft <= 0} onClick={onJoin} />
        </div>
      </Card>
    </div>
  );
}
