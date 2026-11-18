import { useEffect, useRef, useState } from "react";

import { AuthHero } from "@/components/auth/auth-hero";
import { Screen } from "@/components/layout";
import { Button, Skeleton } from "@/components/ui";
import { useSession } from "@/context/session";
import { router, useLocalSearchParams } from "@/lib/router";

/** Opened from the confirmation email: confirms the address and signs the user in. */
export default function VerifyEmailPage() {
  const { token = "" } = useLocalSearchParams<{ token?: string }>();
  const { verifyEmail } = useSession();
  const [state, setState] = useState<"working" | "done" | "failed">("working");
  const started = useRef(false);

  useEffect(() => {
    // The link is single-use, so never send it twice (React StrictMode runs effects twice).
    if (started.current) return;
    started.current = true;
    if (!token) {
      setState("failed");
      return;
    }
    verifyEmail(token).then(({ error }) => {
      setState(error ? "failed" : "done");
      // Strip the token from the address bar and history.
      window.history.replaceState(window.history.state, "", "/verify-email");
    });
  }, [token, verifyEmail]);

  if (state === "working") {
    return (
      <Screen contentClassName="flex-1 items-center justify-center gap-4">
        <span role="status" className="sr-only">
          Confirming your email…
        </span>
        <Skeleton shape="circle" width={80} />
        <Skeleton width={220} height={28} />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="flex-1 justify-center gap-8">
      {state === "done" ? (
        <>
          <AuthHero emoji="🎉" title="Email confirmed" subtitle="Welcome to Koffito! Let's set up your profile." />
          <Button title="Continue" size="lg" fullWidth rightIcon="arrow-forward" onClick={() => router.replace("/survey")} />
        </>
      ) : (
        <>
          <AuthHero
            emoji="🫗"
            title="This link didn't work"
            subtitle="It may have expired or been used already. Log in and we'll send you a fresh one."
          />
          <Button title="Go to log in" size="lg" fullWidth onClick={() => router.replace("/login")} />
        </>
      )}
    </Screen>
  );
}
