import { useState } from "react";

import { CafePicker } from "@/components/events/cafe-picker";
import { combineDateTime, DayPicker, TimePicker } from "@/components/events/date-time-picker";
import { FormField } from "@/components/events/form-field";
import { Stepper } from "@/components/events/stepper";
import { Screen } from "@/components/layout";
import { Button, Card, Header, Input, Text, Toggle, useToast } from "@/components/ui";
import { useEvents } from "@/context/events";
import { useAction } from "@/hooks/use-action";
import { api } from "@/lib/api";
import { goBack } from "@/lib/navigation";
import type { Cafe } from "@/types/koffito";

export default function CreateEventPage() {
  const { createEvent } = useEvents();
  const toast = useToast();
  const run = useAction();

  const [cafe, setCafe] = useState<Cafe>();
  const [day, setDay] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [participants, setParticipants] = useState(4);
  const [locationHidden, setLocationHidden] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    cafe: cafe ? undefined : "Pick a coffee place first",
    day: day ? undefined : "Pick a day",
    time: time ? undefined : "Pick a time",
  };
  const showError = (field: keyof typeof errors) => (submitted ? errors[field] : undefined);

  // Picking a café pre-fills its contact details; they stay editable.
  const handleCafeChange = (next: Cafe) => {
    setCafe(next);
    setWebsite(next.website ?? "");
    setPhone(next.phone ?? "");
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSubmitted(true);
    if (!cafe || !day || !time) return;

    setSaving(true);
    const ok = await run(async () => {
      // Contact details belong to the café, so edits here update it for every coffee talk.
      const contact = { website: website.trim() || null, phone: phone.trim() || null };
      if (contact.website !== (cafe.website ?? null) || contact.phone !== (cafe.phone ?? null)) {
        await api(`/admin/venues/${cafe.id}`, { method: "PATCH", body: contact });
      }
      await createEvent({
        cafe,
        date: combineDateTime(day, time),
        maxParticipants: participants,
        locationHidden,
      });
    }, "Could not create the coffee talk");
    setSaving(false);
    if (!ok) return;
    toast.show({ title: "Coffee talk created!", message: `See you at ${cafe.name} ☕`, variant: "success" });
    goBack();
  };

  return (
    <Screen
      header={<Header title="New event" subtitle="Set up a coffee talk" onBack={goBack} />}
      footer={<Button title="Save" size="lg" fullWidth leftIcon="checkmark" loading={saving} onClick={handleSave} />}>
      <CafePicker value={cafe} onChange={handleCafeChange} error={showError("cafe")} />

      <FormField label="Date" error={showError("day")}>
        <DayPicker value={day} onChange={setDay} />
      </FormField>

      <FormField label="Time" error={showError("time")}>
        <TimePicker value={time} onChange={setTime} />
      </FormField>

      <FormField label="Number of participants">
        <Stepper value={participants} onChange={setParticipants} min={2} max={8} unit="participants" />
      </FormField>

      <Input
        label="Website"
        placeholder="https://"
        leftIcon="globe-outline"
        autoCapitalize="none"
        autoCorrect="off"
        type="url" inputMode="url"
        value={website}
        onChangeText={setWebsite}
      />
      <Input
        label="Phone number"
        placeholder="+40 700 000 000"
        leftIcon="call-outline"
        type="tel" inputMode="tel"
        value={phone}
        onChangeText={setPhone}
      />

      <Card variant="filled" className="flex-row items-center gap-3">
        <div className="flex-1 gap-0.5">
          <Text variant="label">Keep the café a surprise 🤫</Text>
          <Text variant="caption" tone="muted">
            Guests only see the location shortly before the meetup.
          </Text>
        </div>
        <Toggle aria-label="Keep the café a surprise" value={locationHidden} onValueChange={setLocationHidden} />
      </Card>
    </Screen>
  );
}
