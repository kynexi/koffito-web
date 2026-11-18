import type { CoffeeEvent } from "@/types/koffito";

const DAY = 24 * 60 * 60 * 1000;

export const isUpcoming = (event: CoffeeEvent) =>
  event.date.getTime() > Date.now() && event.status !== "cancelled" && event.status !== "completed";

/** How long before the meetup a locked café is revealed. */
const REVEAL_BEFORE_MS = DAY;

export const getRevealTime = (event: CoffeeEvent) =>
  event.revealAt ?? new Date(event.date.getTime() - REVEAL_BEFORE_MS);

/**
 * The single source of truth for how a coffee talk is displayed. Every screen
 * switches on this instead of re-deriving dates, so a backend only has to
 * supply the fields below and the states stay identical.
 *
 *   mystery         blind coffee talk, reveal time not reached yet
 *   awaiting-reveal reveal time passed, the user has not opened it yet
 *   revealed        café is visible (never blind, or opened)
 *   past            the meetup is over: confirm, then review
 */
export type EventState =
  | { kind: "mystery"; revealAt: Date }
  | { kind: "awaiting-reveal" }
  | { kind: "revealed" }
  | { kind: "past"; needsConfirm: boolean; needsReview: boolean };

export const getEventState = (event: CoffeeEvent): EventState => {
  if (!isUpcoming(event)) {
    return {
      kind: "past",
      needsConfirm: event.joined && !event.attendance,
      needsReview: event.joined && event.attendance === "happened" && !event.review,
    };
  }

  if (event.locationHidden && !event.revealOpened) {
    const revealAt = getRevealTime(event);
    return revealAt.getTime() > Date.now() ? { kind: "mystery", revealAt } : { kind: "awaiting-reveal" };
  }

  return { kind: "revealed" };
};

/** Locked cafés stay hidden until the reveal time passes and the user opens them. */
export const isLocationHidden = (event: CoffeeEvent) => {
  const state = getEventState(event);
  return state.kind === "mystery" || state.kind === "awaiting-reveal";
};

/** Café name to show; the real one only after the reveal. */
export const getCafeLabel = (event: CoffeeEvent) => {
  const state = getEventState(event);
  if (state.kind === "mystery") return "Café locked";
  if (state.kind === "awaiting-reveal") return "Café ready to open";
  return event.cafe.name;
};

/** Coffee talks a person has actually had, with the cafés and people they met. */
export const getPersonStats = (events: CoffeeEvent[], userId: string) => {
  const attended = events.filter(
    (event) => event.status === "completed" && event.participants.some((person) => person.id === userId),
  );
  const cafes = new Set(attended.map((event) => event.cafe.id));
  const met = new Set(
    attended.flatMap((event) => event.participants.map((person) => person.id)).filter((id) => id !== userId),
  );

  return { coffeeTalks: attended.length, cafesVisited: cafes.size, peopleMet: met.size };
};

/** Who is coming stays hidden until the reveal, same as the café. */
export const formatAttendance = (event: CoffeeEvent) => {
  if (isLocationHidden(event)) return "Who's coming is a surprise";
  const count = event.participants.length;
  const who = `${count} ${count === 1 ? "person" : "people"}`;
  return isUpcoming(event) ? `${who} going` : `${who} went`;
};
