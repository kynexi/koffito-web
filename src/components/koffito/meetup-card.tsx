
import { AvatarGroup } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import type { Meetup } from "@/types/koffito";
import { MeetupStatus } from "./meetup-status";

export type MeetupCardProps = {
  meetup: Meetup;
  onClick?: () => void;
  /** Shown for pending meetups. */
  onAccept?: () => void;
  onDecline?: () => void;
  animateIn?: boolean | number;
};

const monthFormat = new Intl.DateTimeFormat(undefined, { month: "short" });
const timeFormat = new Intl.DateTimeFormat(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" });

export function MeetupCard({ meetup, onClick, onAccept, onDecline, animateIn }: MeetupCardProps) {
  const { date, participants, status } = meetup;
  const title = meetup.title ?? `Coffee with ${participants.map((person) => person.name.split(" ")[0]).join(" & ")}`;
  const showResponse = status === "pending" && (onAccept || onDecline);

  return (
    <Card onClick={onClick} animateIn={animateIn} className="gap-4">
      <div className="flex-row gap-4">
        <div className="h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
          <Text variant="caption" tone="on-secondary" className="uppercase">
            {monthFormat.format(date)}
          </Text>
          <Text variant="title" tone="on-secondary" className="leading-7">
            {date.getDate()}
          </Text>
        </div>

        <div className="flex-1 gap-1">
          <Text variant="heading" numberOfLines={1} className="text-lg">
            {title}
          </Text>
          <div className="flex-row items-center gap-1.5">
            <Icon name="location-outline" size={15} color="muted" />
            <Text variant="caption" tone="muted" numberOfLines={1} className="flex-1">
              {meetup.address ? `${meetup.place} · ${meetup.address}` : meetup.place}
            </Text>
          </div>
          <div className="flex-row items-center gap-1.5">
            <Icon name="time-outline" size={15} color="muted" />
            <Text variant="caption" tone="muted">
              {timeFormat.format(date)}
            </Text>
          </div>
        </div>
      </div>

      <div className="flex-row items-center justify-between">
        <AvatarGroup people={participants.map((person) => ({ name: person.name, emoji: person.emoji }))} />
        <MeetupStatus status={status} />
      </div>

      {showResponse && (
        <div className="flex-row gap-3">
          {onDecline && (
            <div className="flex-1">
              <Button title="Not this time" variant="outline" size="sm" fullWidth onClick={onDecline} />
            </div>
          )}
          {onAccept && (
            <div className="flex-1">
              <Button title="I'm in" leftIcon="checkmark" size="sm" fullWidth onClick={onAccept} />
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
