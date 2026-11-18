import { router } from "@/lib/router";
import { useState } from "react";

import { Screen } from "@/components/layout";
import { AvatarPicker } from "@/components/profile/avatar-picker";
import {
  isProfileComplete,
  ProfileFields,
  validateProfileFields,
} from "@/components/profile/profile-fields";
import { Button, Header, Input, Modal, useToast } from "@/components/ui";
import { useSession } from "@/context/session";
import { goBack } from "@/lib/navigation";
import { validateRequired } from "@/lib/validation";

export default function MyProfilePage() {
  const { profile, updateProfile } = useSession();
  const toast = useToast();

  // Only the fields edited here; survey answers are changed through the survey itself.
  const { firstName, avatar, gender, age, occupation, favoriteCoffee } =
    profile;
  const saved = { firstName, avatar, gender, age, occupation, favoriteCoffee };

  const [draft, setDraft] = useState(saved);
  const [discardOpen, setDiscardOpen] = useState(false);

  const nameError = validateRequired(
    draft.firstName,
    "Your first name can't be empty",
  );
  const detailErrors = validateProfileFields(draft);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ ...draft, firstName: draft.firstName.trim() });
      toast.show({ title: "Profile saved", variant: "success" });
      goBack();
    } catch (error) {
      toast.show({ title: "Could not save", message: (error as Error).message, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Don't silently drop edits when leaving.
  const handleBack = () => (dirty ? setDiscardOpen(true) : goBack());

  return (
    <Screen
      header={<Header title="My profile" onBack={handleBack} />}
      footer={
        <Button
          title="Save"
          size="lg"
          fullWidth
          disabled={!dirty || !!nameError || !isProfileComplete(draft)}
          loading={saving}
          onClick={handleSave}
        />
      }
    >
      <AvatarPicker
        value={draft.avatar}
        onChange={(avatar) => setDraft({ ...draft, avatar })}
        label="Change avatar"
      />

      <div className="gap-5">
        <Input
          label="Name"
          leftIcon="person-outline"
          autoComplete="given-name"
          value={draft.firstName}
          onChangeText={(firstName) => setDraft({ ...draft, firstName })}
          error={nameError}
        />
        <ProfileFields
          values={draft}
          onChange={(changes) => setDraft({ ...draft, ...changes })}
          errors={detailErrors}
        />
      </div>

      <Button
        title="Retake interests survey"
        variant="outline"
        leftIcon="sparkles-outline"
        fullWidth
        onClick={() =>
          router.push({ pathname: "/survey", params: { mode: "interests" } })
        }
      />

      <Modal
        visible={discardOpen}
        onClose={() => setDiscardOpen(false)}
        emoji="✏️"
        title="Discard your changes?"
        description="Your edits haven't been saved yet."
        primaryAction={{
          title: "Discard",
          variant: "destructive",
          onClick: goBack,
        }}
        secondaryAction={{
          title: "Keep editing",
          onClick: () => setDiscardOpen(false),
        }}
      />
    </Screen>
  );
}
