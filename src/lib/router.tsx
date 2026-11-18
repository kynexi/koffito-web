import { useMemo } from "react";
import { type NavigateFunction, Navigate, useSearchParams } from "react-router";

/**
 * Thin expo-router-style API on top of react-router, so screens keep the same calls
 * (`router.push({ pathname, params })`, `useLocalSearchParams`, `<Redirect>`).
 */
export type Href = string | { pathname: string; params?: Record<string, string | number | undefined> };

let navigate: NavigateFunction | null = null;

/** Wired once by <RouterBridge /> in the app shell. */
export function setNavigate(fn: NavigateFunction) {
  navigate = fn;
}

export function toPath(href: Href) {
  if (typeof href === "string") return href;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(href.params ?? {})) {
    if (value !== undefined) query.set(key, String(value));
  }
  const search = query.toString();
  return search ? `${href.pathname}?${search}` : href.pathname;
}

function go(href: Href, replace = false) {
  navigate?.(toPath(href), { replace });
}

export const router = {
  push: (href: Href) => go(href),
  replace: (href: Href) => go(href, true),
  back: () => navigate?.(-1),
  /** react-router keeps its own history index in history.state. */
  canGoBack: () => ((window.history.state as { idx?: number } | null)?.idx ?? 0) > 0,
};

/** Query-string params of the current screen (`?id=…`), like expo-router's hook. */
export function useLocalSearchParams<T extends Record<string, string | undefined>>(): T {
  const [params] = useSearchParams();
  return useMemo(() => Object.fromEntries(params.entries()) as T, [params]);
}

export function Redirect({ href }: { href: Href }) {
  return <Navigate to={toPath(href)} replace />;
}
