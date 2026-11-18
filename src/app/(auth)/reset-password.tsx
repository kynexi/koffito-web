import { useState } from "react";

import { AuthHero } from "@/components/auth/auth-hero";
import { Screen } from "@/components/layout";
import { Button, Input, useToast } from "@/components/ui";
import { auth } from "@/lib/api";
import { router, useLocalSearchParams } from "@/lib/router";
import { isValid, validatePassword, validatePasswordMatch } from "@/lib/validation";

/** Opened from the reset email: choose a new password. Signs out every device. */
export default function ResetPasswordPage() {
  const { token = "" } = useLocalSearchParams<{ token?: string }>();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string>();

  const errors = {
    password: serverError ?? validatePassword(password),
    confirmation: validatePasswordMatch(password, confirmation),
  };

  const save = async () => {
    setSubmitted(true);
    if (!isValid(errors)) return;
    setLoading(true);
    try {
      await auth.resetPassword(token, password);
      window.history.replaceState(window.history.state, "", "/reset-password");
      toast.show({ title: "Password changed", message: "Log in with your new password.", variant: "success" });
      router.replace("/login");
    } catch (err) {
      const message = (err as Error).message;
      if ((err as { code?: string }).code === "weak_password") setServerError(message);
      else toast.show({ title: "Could not change password", message, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen contentClassName="gap-8 pt-12">
      <AuthHero emoji="🔐" title="Choose a new password" subtitle="Make it something you haven't used here before." />
      <div className="gap-4">
        <Input
          label="New password"
          placeholder="At least 8 characters"
          leftIcon="lock-closed-outline"
          secureTextEntry
          autoComplete="new-password"
          value={password}
          onChangeText={(value) => {
            setServerError(undefined);
            setPassword(value);
          }}
          error={submitted ? errors.password : undefined}
        />
        <Input
          label="Confirm password"
          placeholder="Once more, just to be sure"
          leftIcon="lock-closed-outline"
          secureTextEntry
          autoComplete="new-password"
          value={confirmation}
          onChangeText={setConfirmation}
          onSubmitEditing={save}
          error={submitted ? errors.confirmation : undefined}
        />
      </div>
      <Button title="Save new password" size="lg" fullWidth loading={loading} disabled={!token} onClick={save} />
    </Screen>
  );
}
