import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSession } from "@/context/session";
import { api } from "@/lib/api";
import {
  type ApiMyEvent,
  type ApiOpenEvent,
  type ApiVenue,
  cafeFromApi,
  eventFromMine,
  eventFromOpen,
} from "@/lib/mappers";
import type { Cafe, CoffeeEvent } from "@/types/koffito";

type NewEvent = {
  cafe: Cafe;
  date: Date;
  maxParticipants: number;
  locationHidden?: boolean;
};

type EventsContextValue = {
  /** The user's coffee talks plus open ones they can still join. */
  events: CoffeeEvent[];
  /** Cafés from coffee talks the user went to, most recent first. */
  visitedCafes: Cafe[];
  loading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
  getEvent: (id?: string) => CoffeeEvent | undefined;
  /** Admin only: schedules a new coffee talk. */
  createEvent: (event: NewEvent) => Promise<void>;
  joinEvent: (id: string) => Promise<void>;
  leaveEvent: (id: string) => Promise<void>;
  cancelEvent: (id: string) => Promise<void>;
  /** Opens a café whose reveal time has passed. */
  revealEvent: (id: string) => Promise<void>;
  /** Records whether a past coffee talk happened (with an optional note when it didn't). */
  confirmAttendance: (id: string, happened: boolean, note?: string) => Promise<void>;
  /** Stores the user's review of a coffee talk that happened. */
  reviewEvent: (id: string, review: { rating: number; comment: string }) => Promise<void>;
};

const EventsContext = createContext<EventsContextValue | null>(null);

/** Coffee talks from the API, shared by every screen; actions write through and reload. */
export function EventsProvider({ children }: PropsWithChildren) {
  const { session } = useSession();
  const [events, setEvents] = useState<CoffeeEvent[]>([]);
  const [visitedCafes, setVisitedCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [mine, open, venues] = await Promise.all([
        api<ApiMyEvent[]>("/me/events"),
        api<ApiOpenEvent[]>("/events"),
        api<ApiVenue[]>("/me/venues"),
      ]);
      const own = new Set(mine.map((event) => event.id));
      setEvents([
        ...mine.map(eventFromMine),
        ...open.filter((event) => !own.has(event.id)).map(eventFromOpen),
      ]);
      setVisitedCafes(venues.map(cafeFromApi));
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      void reload();
    } else {
      setEvents([]);
      setVisitedCafes([]);
    }
  }, [session?.userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo<EventsContextValue>(() => {
    const act = (path: string, body?: unknown, method = "POST") => async () => {
      try {
        await api(path, { method, body });
      } finally {
        await reload();
      }
    };

    return {
      events,
      visitedCafes,
      loading,
      error,
      reload,
      getEvent: (id) => events.find((event) => event.id === id),
      createEvent: async ({ cafe, date, maxParticipants, locationHidden }) => {
        await api("/admin/events", {
          method: "POST",
          body: {
            event_at: date.toISOString(),
            default_venue_id: cafe.id,
            target_group_size: Math.min(8, Math.max(2, maxParticipants)),
            location_hidden: locationHidden ?? true,
          },
        });
        await reload();
      },
      joinEvent: (id) => act(`/events/${id}/join`)(),
      leaveEvent: (id) => act(`/events/${id}/leave`)(),
      cancelEvent: (id) => act(`/events/${id}/leave`)(),
      revealEvent: (id) => act(`/events/${id}/reveal`)(),
      confirmAttendance: (id, happened, note) =>
        act(`/events/${id}/attendance`, { happened, note: note?.trim() || null })(),
      reviewEvent: (id, review) => act(`/events/${id}/rating`, review, "PUT")(),
    };
  }, [events, visitedCafes, loading, error, reload]);

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const value = useContext(EventsContext);

  if (!value) {
    throw new Error("useEvents must be used within an EventsProvider");
  }

  return value;
}
