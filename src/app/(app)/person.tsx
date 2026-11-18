import { useEffect, useState } from "react";

import { Screen } from "@/components/layout";
import { ProfileView } from "@/components/profile/profile-view";
import { ErrorState, Header, Skeleton, SkeletonText } from "@/components/ui";
import { toProfileView } from "@/data/users";
import { api } from "@/lib/api";
import { type ApiPublicProfile, userFromCard } from "@/lib/mappers";
import { goBack } from "@/lib/navigation";
import { useLocalSearchParams } from "@/lib/router";

export default function PersonPage() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  // The server only shows people you've shared a revealed coffee talk with.
  const [person, setPerson] = useState<ApiPublicProfile | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return setPerson(null);
    let cancelled = false;
    api<ApiPublicProfile>(`/users/${id}`).then(
      (data) => !cancelled && setPerson(data),
      () => !cancelled && setPerson(null),
    );
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (person === undefined) {
    return (
      <Screen header={<Header title="Profile" onBack={goBack} />}>
        <div className="items-center gap-4 pt-6">
          <Skeleton shape="circle" width={96} />
          <Skeleton width={160} height={28} />
        </div>
        <SkeletonText lines={4} />
      </Screen>
    );
  }

  if (!person) {
    return (
      <Screen header={<Header title="Profile" onBack={goBack} />} contentClassName="flex-1 justify-center">
        <ErrorState
          title="We couldn't find this person"
          description="They may have left the coffee talk."
          retryLabel="Go back"
          onRetry={goBack}
        />
      </Screen>
    );
  }

  const user = userFromCard(person);

  return (
    <Screen header={<Header title={user.name} onBack={goBack} />}>
      {/* Same layout as your own profile, minus the edit button. */}
      <ProfileView
        profile={toProfileView(user)}
        stats={[
          { label: "Coffee talks", value: person.stats.coffeeTalks },
          { label: "Cafés visited", value: person.stats.cafesVisited },
          { label: "People met", value: person.stats.peopleMet },
        ]}
      />
    </Screen>
  );
}
