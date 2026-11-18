import { router } from "@/lib/router";
import { useState } from "react";

import { EventCard } from "@/components/events/event-card";
import { MissedFeedbackSheet } from "@/components/events/missed-feedback-sheet";
import { RateExperienceSheet } from "@/components/events/rate-experience-sheet";
import { Screen } from "@/components/layout";
import { Chip, EmptyState, Header, useToast } from "@/components/ui";
import { useEvents } from "@/context/events";
import { isUpcoming } from "@/data/events";
import { useAction } from "@/hooks/use-action";

type Filter = "upcoming" | "past";

const filters: { key: Filter; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
];

export default function EventsPage() {
  const { events, confirmAttendance, reviewEvent } = useEvents();
  const toast = useToast();
  const run = useAction();
  const [filter, setFilter] = useState<Filter>("upcoming");
  // Which past coffee talk is being reviewed, and in which sheet.
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [missed, setMissed] = useState<string | null>(null);

  const openReport = (id: string | null) => {
    setReviewing(null);
    setMissed(null);
    router.push({ pathname: "/report", params: id ? { eventId: id } : {} });
  };

  const handleConfirm = async (id: string, happened: boolean) => {
    if (!(await run(() => confirmAttendance(id, happened), "Could not save"))) return;
    if (happened) setReviewing(id);
    else setMissed(id);
  };

  const handleReview = async (rating: number, comment: string) => {
    const id = reviewing;
    setReviewing(null);
    if (id && (await run(() => reviewEvent(id, { rating, comment }), "Could not save the review"))) {
      toast.show({ title: "Thanks for the review!", variant: "success" });
    }
  };

  const handleMissed = async (comment: string) => {
    const id = missed;
    setMissed(null);
    if (id && (await run(() => confirmAttendance(id, false, comment), "Could not save"))) {
      toast.show({ title: "Thanks for letting us know", variant: "info" });
    }
  };

  const mine = events.filter((event) => event.joined);
  const visible = mine
    .filter((event) => (filter === "upcoming" ? isUpcoming(event) : !isUpcoming(event)))
    .sort((a, b) => (filter === "upcoming" ? a.date.getTime() - b.date.getTime() : b.date.getTime() - a.date.getTime()));

  return (
    <Screen
      tabBarInset
      header={
        <Header
          size="large"
          title="Events"
          subtitle="Your coffee talks, all in one place"
        />
      }
      contentClassName="gap-4">
      <div className="flex-row gap-2">
        {filters.map((item) => (
          <Chip key={item.key} label={item.label} selected={filter === item.key} onClick={() => setFilter(item.key)} />
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          emoji=""
          title={filter === "upcoming" ? "No coffee talks planned" : "No past coffee talks yet"}
          description={filter === "upcoming" ? "There's always someone new to meet." : "Your coffee stories will show up here."}
          action={{ title: "Find coffee talk", leftIcon: "search", onClick: () => router.push("/find-coffee-talk") }}
          className="flex-1 justify-center"
        />
      ) : (
        <>
          {visible.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              animateIn={index}
              onClick={() => router.push({ pathname: "/event-details", params: { id: event.id } })}
              onConfirm={(happened) => handleConfirm(event.id, happened)}
              onReview={() => setReviewing(event.id)}
            />
          ))}
        </>
      )}

      <RateExperienceSheet
        visible={!!reviewing}
        onClose={() => setReviewing(null)}
        onSubmit={handleReview}
        onReport={() => openReport(reviewing)}
      />

      <MissedFeedbackSheet
        visible={!!missed}
        onClose={() => setMissed(null)}
        onSubmit={handleMissed}
        onReport={() => openReport(missed)}
      />
    </Screen>
  );
}
