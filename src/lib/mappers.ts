/**
 * API shapes → the app's own types (src/types/koffito.ts), so screens keep working unchanged.
 */

import type { Cafe, CoffeeEvent, MeetupStatusType, Profile, SurveyAnswers, User } from "@/types/koffito";

// --- API types (see the backend's schemas) ------------------------------------------------------

export type ApiGender = "female" | "male" | "non_binary" | "prefer_not_to_say";

export type ApiProfileCard = {
  id: string;
  name: string;
  emoji?: string | null;
  gender?: ApiGender | null;
  age?: number | null;
  languages?: string[];
  occupation?: string | null;
  favoriteCoffee?: string | null;
  survey?: SurveyAnswers;
};

export type ApiStats = { coffeeTalks: number; cafesVisited: number; peopleMet: number };

export type ApiMe = ApiProfileCard & {
  stats: ApiStats;
  isAdmin: boolean;
  onboarded: boolean;
  settings: { notificationsEnabled: boolean; remindersEnabled: boolean };
};

export type ApiPublicProfile = ApiProfileCard & { stats: ApiStats };

export type ApiVenue = {
  id: string;
  name: string;
  description?: string;
  photo?: string | null;
  address: string;
  website?: string | null;
  phone?: string | null;
  rating?: number | null;
  popularTimes?: number[];
};

export type ApiMyEvent = {
  id: string;
  event_at: string;
  reveal_at: string;
  status: MeetupStatusType;
  participant_status: string;
  joined: boolean;
  blind: boolean;
  location_hidden: boolean;
  reveal_opened: boolean;
  max_participants: number;
  cafe: ApiVenue | null;
  participants: ApiProfileCard[] | null;
  attended: boolean | null;
  attendance_note: string | null;
  my_rating: number | null;
  my_comment: string | null;
};

export type ApiOpenEvent = {
  id: string;
  event_at: string;
  reveal_at: string;
  blind: boolean;
  max_participants: number;
  spots_left: number;
  joined: boolean;
  /** Only for non-blind coffee talks. */
  cafe: ApiVenue | null;
};

// --- gender: API enum ↔ the labels the app shows ------------------------------------------------

const genderLabels: Record<ApiGender, string> = {
  female: "Female",
  male: "Male",
  non_binary: "Non-binary",
  prefer_not_to_say: "Prefer not to say",
};

export const genderFromApi = (gender?: ApiGender | null) => (gender ? genderLabels[gender] : undefined);

export const genderToApi = (label?: string) =>
  (Object.entries(genderLabels).find(([, value]) => value === label)?.[0] as ApiGender | undefined) ?? undefined;

/** The API stores a date of birth; the app asks for an age. Pick a birthday that gives that age today. */
export function birthDateForAge(age: string) {
  const today = new Date();
  const birth = new Date(today.getFullYear() - Number(age), today.getMonth(), today.getDate());
  return `${birth.getFullYear()}-${String(birth.getMonth() + 1).padStart(2, "0")}-${String(birth.getDate()).padStart(2, "0")}`;
}

// --- people -------------------------------------------------------------------------------------

export function userFromCard(card: ApiProfileCard): User {
  return {
    id: card.id,
    name: card.name,
    emoji: card.emoji ?? undefined,
    age: card.age ?? undefined,
    gender: genderFromApi(card.gender),
    occupation: card.occupation ?? undefined,
    favoriteCoffee: card.favoriteCoffee ?? undefined,
    survey: card.survey ?? {},
    interests: [],
  };
}

export function profileFromMe(me: ApiMe, email?: string): Profile {
  return {
    firstName: me.name,
    email,
    avatar: me.emoji ?? undefined,
    gender: genderFromApi(me.gender),
    age: me.age != null ? String(me.age) : undefined,
    occupation: me.occupation ?? undefined,
    favoriteCoffee: me.favoriteCoffee ?? undefined,
    survey: me.survey ?? {},
    onboarded: me.onboarded,
  };
}

// --- cafés & coffee talks -----------------------------------------------------------------------

/** Neutral stand-in while a blind coffee talk's café is still secret: the server never sends it. */
const HIDDEN_CAFE: Cafe = {
  id: "hidden",
  name: "Mystery café",
  description: "",
  photo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=60&fit=crop",
  address: "",
  rating: 0,
  popularTimes: [],
};

export function cafeFromApi(venue: ApiVenue): Cafe {
  return {
    id: venue.id,
    name: venue.name,
    description: venue.description ?? "",
    photo: venue.photo ?? HIDDEN_CAFE.photo,
    address: venue.address,
    website: venue.website ?? undefined,
    phone: venue.phone ?? undefined,
    rating: venue.rating ?? 0,
    popularTimes: venue.popularTimes ?? [],
  };
}

export function eventFromMine(event: ApiMyEvent): CoffeeEvent {
  return {
    id: event.id,
    cafe: event.cafe ? cafeFromApi(event.cafe) : HIDDEN_CAFE,
    date: new Date(event.event_at),
    revealAt: new Date(event.reveal_at),
    participants: (event.participants ?? []).map(userFromCard),
    maxParticipants: event.max_participants,
    status: event.status,
    joined: event.joined,
    locationHidden: event.blind,
    revealOpened: event.reveal_opened || !event.blind,
    attendance: event.attended == null ? undefined : event.attended ? "happened" : "missed",
    review: event.my_rating != null ? { rating: event.my_rating, comment: event.my_comment ?? "" } : undefined,
  };
}

export function eventFromOpen(event: ApiOpenEvent): CoffeeEvent {
  return {
    id: event.id,
    cafe: event.cafe ? cafeFromApi(event.cafe) : HIDDEN_CAFE,
    date: new Date(event.event_at),
    revealAt: new Date(event.reveal_at),
    participants: [],
    maxParticipants: event.max_participants,
    spotsLeft: event.spots_left,
    status: "pending",
    joined: event.joined,
    locationHidden: event.blind,
    // A blind café stays closed for people who haven't joined, even after the reveal time.
    revealOpened: !event.blind,
  };
}
