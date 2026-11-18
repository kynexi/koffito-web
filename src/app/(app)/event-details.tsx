import { router, useLocalSearchParams } from "@/lib/router";
import { useState } from "react";

import { EventHero } from "@/components/events/event-hero";
import { InfoRow } from "@/components/events/info-row";
import { LocationCountdown } from "@/components/events/location-countdown";
import { PeopleGoing } from "@/components/events/people-going";
import { MeetupStatus, UserCard } from "@/components/koffito";
import { Screen } from "@/components/layout";
import {
  BottomSheet,
  Button,
  Card,
  ErrorState,
  Header,
  IconButton,
  Modal,
  Skeleton,
  SkeletonText,
  Text,
  useToast,
} from "@/components/ui";
import { useEvents } from "@/context/events";
import { getEventState, getRevealTime, isUpcoming } from "@/data/events";
import { formatDateTime } from "@/lib/date";
import { useAction } from "@/hooks/use-action";
import { goBack } from "@/lib/navigation";

export default function EventDetailsPage() {
  // `id` opens a coffee talk; `cafeId` opens a café on its own (e.g. from "Cafés you've visited").
  const { id, cafeId } = useLocalSearchParams<{
    id?: string;
    cafeId?: string;
  }>();
  const { getEvent, joinEvent, cancelEvent, revealEvent, visitedCafes, loading } = useEvents();
  const toast = useToast();
  const run = useAction();

  const [cancelOpen, setCancelOpen] = useState(false);
  const [peopleOpen, setPeopleOpen] = useState(false);

  const event = getEvent(id);
  const cafe = event?.cafe ?? visitedCafes.find((item) => item.id === cafeId);

  if (!cafe && loading) {
    return (
      <Screen header={<Header title="Coffee talk" onBack={goBack} />}>
        <Skeleton height={300} className="-mx-5 rounded-none" />
        <SkeletonText lines={3} />
      </Screen>
    );
  }

  if (!cafe) {
    return (
      <Screen
        header={<Header title="Coffee talk" onBack={goBack} />}
        contentClassName="flex-1 justify-center"
      >
        <ErrorState
          title="We lost this coffee talk"
          description="It may have been cancelled or removed."
          retryLabel="Go back"
          onRetry={goBack}
        />
      </Screen>
    );
  }

  const upcoming = !!event && isUpcoming(event);
  const state = event ? getEventState(event) : undefined;
  const hidden = state?.kind === "mystery" || state?.kind === "awaiting-reveal";
  const spotsLeft = event
    ? (event.spotsLeft ?? event.maxParticipants - event.participants.length)
    : 0;

  const openReport = () =>
    router.push({
      pathname: "/report",
      params: event ? { eventId: event.id } : {},
    });

  const handleCancel = async () => {
    if (!event) return;
    setCancelOpen(false);
    if (!(await run(() => cancelEvent(event.id), "Could not cancel"))) return;
    toast.show({
      title: "Coffee talk cancelled",
      message: "Maybe next time.",
      variant: "info",
    });
    goBack();
  };

  const handleJoin = async () => {
    if (!event) return;
    if (!(await run(() => joinEvent(event.id), "Could not join"))) return;
    toast.show({
      title: "You're in!",
      message: `We saved you a seat at ${cafe.name}`,
      variant: "success",
    });
  };

  const footer =
    !event || !upcoming ? undefined : event.joined ? (
      <Button
        title="Cancel coffee talk"
        variant="destructive"
        size="lg"
        fullWidth
        onClick={() => setCancelOpen(true)}
      />
    ) : (
      <Button
        title="Join meeting"
        size="lg"
        fullWidth
        leftIcon="cafe"
        disabled={spotsLeft <= 0}
        onClick={handleJoin}
      />
    );

  return (
    <Screen edgeToEdge footer={footer} contentClassName="px-0 pt-0">
      <EventHero
        photo={cafe.photo}
        hidden={hidden}
        onBack={goBack}
        aria-label={
          hidden ? "Hidden café picture" : `Photo of ${cafe.name}`
        }
        actions={
          <IconButton
            icon="flag-outline"
            aria-label="Report a problem"
            onClick={openReport}
          />
        }
      >
        {state?.kind === "mystery" && event && (
          <LocationCountdown revealAt={getRevealTime(event)} />
        )}
        {state?.kind === "awaiting-reveal" && event && (
          <div className="animate-in zoom-in-0 fade-in duration-[220ms]">
            <Button
              title="Reveal the café"
              size="lg"
              leftIcon="lock-open-outline"
              onClick={() => void run(() => revealEvent(event.id), "Could not open the café")}
            />
          </div>
        )}
      </EventHero>

      <div className="gap-6 px-5">
        {/* Faces and headcount stay hidden until the café is revealed. */}
        {event && !hidden && (
          <PeopleGoing
            people={event.participants}
            past={!upcoming}
            onClick={() => setPeopleOpen(true)}
          />
        )}

        <div className="gap-2">
          <div className="flex-row items-start justify-between gap-3">
            <Text variant="title" className="flex-1">
              {hidden ? "Mystery café" : cafe.name}
            </Text>
            {event && <MeetupStatus status={event.status} className="mt-1.5" />}
          </div>
          <Text tone="muted">
            {hidden
              ? "The café will be revealed a day before the meet up. Can you handle the suspense?"
              : cafe.description}
          </Text>
        </div>

        <Card className="gap-3">
          {event && (
            <InfoRow
              icon="calendar-outline"
              label={formatDateTime(event.date)}
            />
          )}
          {hidden ? (
            <InfoRow
              icon="lock-closed-outline"
              label="Details hidden until the reveal"
            />
          ) : (
            <>
              <InfoRow icon="location-outline" label={cafe.address} />
              {cafe.website && (
                <InfoRow
                  icon="globe-outline"
                  label={cafe.website.replace(/^https?:\/\//, "")}
                  onClick={() => window.open(cafe.website!, "_blank", "noopener")}
                />
              )}
              {cafe.phone && (
                <InfoRow
                  icon="call-outline"
                  label={cafe.phone}
                  onClick={() =>
                    window.location.assign(`tel:${cafe.phone!.replace(/\s/g, "")}`)
                  }
                />
              )}
            </>
          )}
        </Card>
      </div>

      <BottomSheet
        visible={peopleOpen}
        onClose={() => setPeopleOpen(false)}
        title="Who's going"
        description="Tap someone to see their profile."
      >
        <div className="gap-2 pb-4">
          {event?.participants.map((person) => (
            <UserCard
              key={person.id}
              user={person}
              variant="compact"
              onClick={() => {
                setPeopleOpen(false);
                router.push({ pathname: "/person", params: { id: person.id } });
              }}
            />
          ))}
        </div>
      </BottomSheet>

      <Modal
        visible={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel this coffee talk?"
        description="The others will be told you can't make it. You can always join another one."
        primaryAction={{
          title: "Yes, cancel it",
          variant: "destructive",
          onClick: handleCancel,
        }}
        secondaryAction={{
          title: "Keep my seat",
          onClick: () => setCancelOpen(false),
        }}
      />
    </Screen>
  );
}
