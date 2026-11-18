import { useEffect, useState } from "react";

import { AuthHero } from "@/components/auth/auth-hero";
import { AuthSwitchLink } from "@/components/auth/auth-switch-link";
import { Screen } from "@/components/layout";
import { Button, Card, Header, Text, useToast } from "@/components/ui";
import { auth } from "@/lib/api";
import { router, useLocalSearchParams } from "@/lib/router";

const RESEND_COOLDOWN = 60;

/** After sign-up (or a login before confirming): "check your inbox", with a resend button. */
export default function CheckEmailPage() {
  const { email = "" } = useLocalSearchParams<{ email?: string }>();
  const toast = useToast();
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const resend = async () => {
    setSending(true);
    try {
      await auth.resendVerification(email);
      toast.show({ title: "Sent again", message: "Give it a minute and check spam too.", variant: "success" });
      setCooldown(RESEND_COOLDOWN);
    } catch (error) {
      toast.show({ title: "Could not send", message: (error as Error).message, variant: "error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Screen
      header={<Header title="" onBack={router.canGoBack() ? router.back : undefined} />}
      contentClassName="gap-8 pt-4">
      <AuthHero
        emoji="📬"
        title="Check your inbox"
        subtitle="We sent you a link to confirm your email. Tap it and you're in."
      />

      {email ? (
        <Card variant="filled" padding="md" className="items-center gap-1">
          <Text variant="caption" tone="muted">
            Sent to
          </Text>
          <Text variant="label" className="text-center">
            {email}
          </Text>
        </Card>
      ) : null}

      <div className="gap-2">
        <Button
          title={cooldown > 0 ? `Resend email in ${cooldown}s` : "Resend email"}
          variant="secondary"
          size="lg"
          fullWidth
          leftIcon="mail-outline"
          loading={sending}
          disabled={!email || cooldown > 0}
          onClick={resend}
        />
        <AuthSwitchLink prompt="Already confirmed?" actionLabel="Log in" onClick={() => router.replace("/login")} />
      </div>
    </Screen>
  );
}
