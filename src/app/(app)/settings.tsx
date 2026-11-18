import { router } from "@/lib/router";
import { useState } from "react";

import { Screen } from "@/components/layout";
import {
  SettingsRow,
  SettingsSection,
} from "@/components/settings/settings-section";
import { Header, Modal, Text, useToast } from "@/components/ui";
import { useSession } from "@/context/session";
import { goBack } from "@/lib/navigation";

export default function SettingsPage() {
  const { signOut, me, updateSettings, isAdmin } = useSession();
  const toast = useToast();

  // Shown immediately, saved in the background; flips back if the save fails.
  const [notifications, setNotifications] = useState(me?.settings.notificationsEnabled ?? true);
  const [reminders, setReminders] = useState(me?.settings.remindersEnabled ?? true);
  const [signOutOpen, setSignOutOpen] = useState(false);

  const saveToggle = (key: "notifications" | "reminders", set: (value: boolean) => void) => (value: boolean) => {
    set(value);
    updateSettings({ [key]: value }).catch((error: Error) => {
      set(!value);
      toast.show({ title: "Could not save", message: error.message, variant: "error" });
    });
  };

  return (
    <Screen header={<Header title="Settings" onBack={goBack} />}>
      <SettingsSection title="Account">
        <SettingsRow
          icon="person-outline"
          label="My profile"
          description="Avatar, name and the basics"
          onClick={() => router.push("/survey-profile-settings")}
        />
        <SettingsRow
          icon="sparkles-outline"
          label="Retake interests survey"
          description="Update what you like talking about"
          onClick={() =>
            router.push({ pathname: "/survey", params: { mode: "interests" } })
          }
        />
        <SettingsRow
          icon="lock-closed-outline"
          label="Change password"
          description="Signs you out on other devices"
          onClick={() => router.push("/change-password")}
        />
      </SettingsSection>

      <SettingsSection title="Preferences">
        <SettingsRow
          icon="notifications-outline"
          label="Notifications"
          description="Opportunities, event updates and more"
          toggle={{ value: notifications, onChange: saveToggle("notifications", setNotifications) }}
        />
        <SettingsRow
          icon="alarm-outline"
          label="Coffee talk reminders"
          description="A nudge before each meetup"
          toggle={{ value: reminders, onChange: saveToggle("reminders", setReminders) }}
        />
      </SettingsSection>

      {isAdmin && (
        <SettingsSection title="Admin">
          <SettingsRow
            icon="calendar-outline"
            label="Schedule a coffee talk"
            description="Pick a café and a time"
            onClick={() => router.push("/create-event")}
          />
          <SettingsRow
            icon="flag-outline"
            label="Reports"
            description="Review what people reported"
            onClick={() => router.push("/admin")}
          />
        </SettingsSection>
      )}

      <SettingsSection title="Support">
        <SettingsRow
          icon="flag-outline"
          label="Report a problem"
          onClick={() => router.push("/report")}
        />
      </SettingsSection>

      <SettingsSection title="Session">
        <SettingsRow
          icon="log-out-outline"
          label="Log out"
          tone="error"
          onClick={() => setSignOutOpen(true)}
        />
      </SettingsSection>

      <Text variant="caption" tone="muted" className="text-center">
        Koffito · made with ☕
      </Text>

      <Modal
        visible={signOutOpen}
        onClose={() => setSignOutOpen(false)}
        emoji="👋"
        title="Leaving already?"
        description="You'll need to log in again to join coffee talks."
        primaryAction={{
          title: "Log out",
          variant: "destructive",
          onClick: () => void signOut(),
        }}
        secondaryAction={{
          title: "Stay",
          onClick: () => setSignOutOpen(false),
        }}
      />
    </Screen>
  );
}
