import { router } from "./router";

/** Goes back when there is history; otherwise (deep link, refresh) falls back to Home. */
export function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace("/");
  }
}
