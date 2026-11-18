import { useState } from "react";

import { Screen } from "@/components/layout";
import { Button, Header, Input, Text, useToast } from "@/components/ui";
import { auth } from "@/lib/api";
import { goBack } from "@/lib/navigation";
import { isValid, validatePassword, validatePasswordMatch, validateRequired } from "@/lib/validation";

/** Settings → Change password. Other devices are signed out; this one stays signed in. */
export default function ChangePasswordPage() {
  const toast = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<{ current?: string; next?: string }>({});

  const errors = {
    current: serverErrors.current ?? validateRequired(current, "Enter your current password"),
    next: serverErrors.next ?? validatePassword(next),
    confirmation: validatePasswordMatch(next, confirmation),
  };

  const save = async () => {
    setSubmitted(true);
    if (!isValid(errors)) return;
    setLoading(true);
    try {
      await auth.changePassword(current, next);
      toast.show({ title: "Password changed", message: "Other devices were signed out.", variant: "success" });
      goBack();
    } catch (err) {
      const { code, message } = err as { code?: string; message: string };
      if (code === "invalid_credentials") setServerErrors({ current: message });
      else if (code === "weak_password") setServerErrors({ next: message });
      else toast.show({ title: "Could not change password", message, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen
      header={<Header title="Change password" onBack={goBack} />}
      footer={<Button title="Save password" size="lg" fullWidth loading={loading} onClick={save} />}>
      <Text tone="muted">You'll stay logged in here. Everywhere else you'll need the new password.</Text>
      <div className="gap-4">
        <Input
          label="Current password"
          leftIcon="lock-closed-outline"
          secureTextEntry
          autoComplete="current-password"
          value={current}
          onChangeText={(value) => {
            setServerErrors({});
            setCurrent(value);
          }}
          error={submitted ? errors.current : undefined}
        />
        <Input
          label="New password"
          placeholder="At least 8 characters"
          leftIcon="lock-closed-outline"
          secureTextEntry
          autoComplete="new-password"
          value={next}
          onChangeText={(value) => {
            setServerErrors({});
            setNext(value);
          }}
          error={submitted ? errors.next : undefined}
        />
        <Input
          label="Confirm new password"
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
    </Screen>
  );
}
