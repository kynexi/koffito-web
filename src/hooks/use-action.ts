import { useCallback } from "react";

import { useToast } from "@/components/ui/toast";

/** Messages for the event rules the server enforces, in the app's tone. */
const friendly: Record<string, string> = {
  survey_incomplete: "Finish the survey first, so we can match you well.",
  event_full: "This coffee talk just filled up. Try another time.",
  time_conflict: "You already have a coffee talk around that time.",
  event_not_open: "This coffee talk isn't taking new people any more.",
  nothing_to_cancel: "There's nothing to cancel here any more.",
  not_revealed_yet: "Not yet! The café opens 24 hours before.",
  not_attended: "You can review coffee talks you went to.",
};

/**
 * Runs an API call and shows a toast when it fails. Resolves to `true` on success, so the
 * caller only celebrates (toast, navigation) when the server actually accepted it.
 */
export function useAction() {
  const toast = useToast();

  return useCallback(
    async (work: () => Promise<unknown>, failTitle = "That didn't work") => {
      try {
        await work();
        return true;
      } catch (error) {
        const { code, message } = error as { code?: string; message?: string };
        toast.show({
          title: failTitle,
          message: (code && friendly[code]) || message || "Please try again.",
          variant: "error",
        });
        return false;
      }
    },
    [toast],
  );
}
