import { useState } from "react";

import { AuthHero } from "@/components/auth/auth-hero";
import { AuthSwitchLink } from "@/components/auth/auth-switch-link";
import { Screen } from "@/components/layout";
import { Button, Header, Input, useToast } from "@/components/ui";
import { auth } from "@/lib/api";
import { router, useLocalSearchParams } from "@/lib/router";
import { validateEmail } from "@/lib/validation";

/** "Forgot password?": asks for the email and sends a reset link. */
export default function ForgotPasswordPage() {
  const params = useLocalSearchParams<{ email?: string }>();
  const toast = useToast();
  const [email, setEmail] = useState(params.email ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const error = validateEmail(email);

  const send = async () => {
    setSubmitted(true);
    if (error) return;
    setLoading(true);
    try {
      await auth.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      toast.show({ title: "Could not send", message: (err as Error).message, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen
      header={<Header title="" onBack={router.canGoBack() ? router.back : () => router.replace("/login")} />}
      contentClassName="gap-8 pt-4">
      {sent ? (
        <>
          <AuthHero
            emoji="📬"
            title="Check your inbox"
            subtitle={`If ${email.trim()} has a Koffito account, a link to choose a new password is on its way.`}
          />
          <Button title="Back to log in" size="lg" fullWidth onClick={() => router.replace("/login")} />
        </>
      ) : (
        <>
          <AuthHero emoji="🔑" title="Forgot your password?" subtitle="No worries. We'll email you a link to pick a new one." />
          <Input
            label="Email"
            placeholder="you@example.com"
            leftIcon="mail-outline"
            autoCapitalize="none"
            autoCorrect="off"
            type="email"
            inputMode="email"
            autoComplete="email"
            enterKeyHint="send"
            value={email}
            onChangeText={setEmail}
            onSubmitEditing={send}
            error={submitted ? error : undefined}
          />
          <div className="gap-2">
            <Button title="Send reset link" size="lg" fullWidth loading={loading} onClick={send} />
            <AuthSwitchLink prompt="Remembered it?" actionLabel="Log in" onClick={() => router.replace("/login")} />
          </div>
        </>
      )}
    </Screen>
  );
}
