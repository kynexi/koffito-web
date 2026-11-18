import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { api, ApiError, auth, refreshSession, setSignedOutHandler } from "@/lib/api";
import { type ApiMe, birthDateForAge, genderToApi, profileFromMe } from "@/lib/mappers";
import type { Profile } from "@/types/koffito";

type Result = { error: ApiError | null };

type SessionContextValue = {
  /** Non-null while signed in. */
  session: { userId: string } | null;
  isLoading: boolean;
  profile: Profile;
  me: ApiMe | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<Result>;
  /** Creates the account; the user then confirms their email before signing in. */
  signUp: (email: string, password: string, firstName: string) => Promise<Result & { needsEmailConfirmation: boolean }>;
  /** Signs in with the link from the confirmation email. */
  verifyEmail: (token: string) => Promise<Result>;
  signOut: () => Promise<Result>;
  /** Saves profile fields and/or survey answers to the server. Throws ApiError. */
  updateProfile: (changes: Partial<Profile>) => Promise<void>;
  updateSettings: (changes: { notifications?: boolean; reminders?: boolean }) => Promise<void>;
  reload: () => Promise<void>;
};

const emptyProfile: Profile = { firstName: "", survey: {}, onboarded: false };

const SessionContext = createContext<SessionContextValue | null>(null);

const asError = (error: unknown) =>
  error instanceof ApiError ? error : new ApiError(0, "network_error", "We can't reach Koffito right now.");

export function SessionProvider({ children }: PropsWithChildren) {
  const [me, setMe] = useState<ApiMe | null>(null);
  const [email, setEmail] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  const loadMe = useCallback(async () => {
    setMe(await api<ApiMe>("/me"));
  }, []);

  // On start: the refresh cookie (if any) gives us an access token without asking for a password.
  useEffect(() => {
    setSignedOutHandler(() => setMe(null));
    let cancelled = false;
    (async () => {
      try {
        if (await refreshSession()) {
          const next = await api<ApiMe>("/me");
          if (!cancelled) setMe(next);
        }
      } catch {
        // Stay signed out; the user can sign in again.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      session: me ? { userId: me.id } : null,
      isLoading,
      me,
      isAdmin: !!me?.isAdmin,
      profile: me ? profileFromMe(me, email) : emptyProfile,
      signIn: async (address, password) => {
        try {
          await auth.login(address.trim(), password);
          setEmail(address.trim().toLowerCase());
          await loadMe();
          return { error: null };
        } catch (error) {
          return { error: asError(error) };
        }
      },
      signUp: async (address, password, firstName) => {
        try {
          await auth.register(address.trim(), password, firstName.trim());
          return { error: null, needsEmailConfirmation: true };
        } catch (error) {
          return { error: asError(error), needsEmailConfirmation: false };
        }
      },
      verifyEmail: async (token) => {
        try {
          await auth.verifyEmail(token);
          await loadMe();
          return { error: null };
        } catch (error) {
          return { error: asError(error) };
        }
      },
      signOut: async () => {
        try {
          await auth.logout();
          return { error: null };
        } catch (error) {
          return { error: asError(error) };
        } finally {
          setMe(null);
        }
      },
      updateProfile: async (changes) => {
        const patch: Record<string, unknown> = {};
        if (changes.firstName !== undefined) patch.display_name = changes.firstName.trim();
        if (changes.avatar !== undefined) patch.avatar_emoji = changes.avatar;
        if (changes.gender !== undefined) patch.gender = genderToApi(changes.gender);
        if (changes.age !== undefined) patch.date_of_birth = birthDateForAge(changes.age);
        if (changes.occupation !== undefined) patch.occupation = changes.occupation.trim();
        if (changes.favoriteCoffee !== undefined) patch.favorite_coffee = changes.favoriteCoffee;
        if (changes.survey !== undefined) {
          await api("/me/survey", { method: "PUT", body: { survey_data: changes.survey, completed: true } });
        }
        if (changes.onboarded !== undefined) patch.onboarded = changes.onboarded;
        if (Object.keys(patch).length > 0) await api("/me", { method: "PATCH", body: patch });
        await loadMe();
      },
      updateSettings: async ({ notifications, reminders }) => {
        await api("/me/settings", {
          method: "PATCH",
          body: { notifications_enabled: notifications, reminders_enabled: reminders },
        });
        await loadMe();
      },
      reload: loadMe,
    }),
    [me, email, isLoading, loadMe],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);

  if (!value) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return value;
}
