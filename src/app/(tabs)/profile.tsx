import { router } from "@/lib/router";

import { Screen } from "@/components/layout";
import { ProfileView } from "@/components/profile/profile-view";
import { Button, Header, IconButton } from "@/components/ui";
import { useSession } from "@/context/session";

export default function ProfilePage() {
  const { profile, me } = useSession();

  const stats = [
    { label: "Coffee talks", value: me?.stats.coffeeTalks ?? 0 },
    { label: "Cafés visited", value: me?.stats.cafesVisited ?? 0 },
    { label: "People met", value: me?.stats.peopleMet ?? 0 },
  ];

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ");

  return (
    <Screen
      tabBarInset
      header={
        <Header
          title="Profile"
          right={
            <IconButton
              icon="settings-outline"
              aria-label="Settings"
              onClick={() => router.push("/settings")}
            />
          }
        />
      }
    >
      <ProfileView
        profile={{ ...profile, name: fullName }}
        title={`Hi, ${fullName}!`}
        stats={stats}
        action={
          <Button
            title="Edit profile"
            variant="secondary"
            size="sm"
            leftIcon="create-outline"
            onClick={() => router.push("/survey-profile-settings")}
          />
        }
      />
    </Screen>
  );
}
