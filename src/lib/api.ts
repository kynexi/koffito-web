/**
 * Talks to the Koffito backend at `/api` (the Vite dev proxy, or a reverse proxy in production,
 * forwards it to the FastAPI server — so the app and API share one origin and no CORS is needed).
 *
 * Security model on this side:
 *  - The access token lives only in memory (never localStorage), so a script injected into the
 *    page later can't read a stored token.
 *  - The refresh token is an httpOnly cookie the browser sends to /api/auth/* by itself; this
 *    code never sees it.
 *  - Refreshes are serialised across tabs with the Web Locks API: tokens rotate on every use, and
 *    the server treats a reused one as stolen, so two tabs must never refresh with the same one.
 */

const BASE = "/api";
const CSRF = { "X-Requested-With": "koffito" };

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type Session = { access_token: string; expires_in: number };

let accessToken: string | null = null;
let onSignedOut: (() => void) | null = null;
let refreshing: Promise<boolean> | null = null;

/** Called when the session can't be renewed any more (refresh rejected). */
export function setSignedOutHandler(handler: () => void) {
  onSignedOut = handler;
}

export function hasAccessToken() {
  return accessToken !== null;
}

function storeSession(session: Session) {
  accessToken = session.access_token;
}

async function parse(response: Response) {
  if (response.status === 204) return undefined;
  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;
  if (!response.ok) {
    const error = data?.error ?? {};
    throw new ApiError(
      response.status,
      error.code ?? "http_error",
      friendlyMessage(error.code, error.message ?? response.statusText),
      error.details,
    );
  }
  return data;
}

/** Messages for the codes users can actually hit, in the app's tone. */
function friendlyMessage(code: string | undefined, fallback: string) {
  switch (code) {
    case "rate_limited":
      return "Too many tries. Take a sip and try again in a minute.";
    case "upstream_unavailable":
      return "We can't reach Koffito right now. Try again shortly.";
    case "validation_error":
      return "Some details don't look right.";
    default:
      return fallback;
  }
}

/** Renew the access token from the refresh cookie. Returns false when signed out. */
export function refreshSession(): Promise<boolean> {
  refreshing ??= (async () => {
    const run = async () => {
      try {
        const response = await fetch(`${BASE}/auth/refresh`, {
          method: "POST",
          headers: CSRF,
          credentials: "same-origin",
        });
        if (!response.ok) {
          accessToken = null;
          return false;
        }
        storeSession(await response.json());
        return true;
      } catch {
        return false;
      }
    };
    try {
      return navigator.locks ? await navigator.locks.request("koffito-refresh", run) : await run();
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

type RequestOptions = { method?: string; body?: unknown; auth?: boolean };

/** JSON request to the API; retries once after renewing an expired access token. */
export async function api<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const send = () =>
    fetch(`${BASE}${path}`, {
      method,
      credentials: "same-origin",
      headers: {
        ...CSRF,
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(auth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let response = await send();
  if (auth && response.status === 401) {
    if (await refreshSession()) {
      response = await send();
    } else {
      onSignedOut?.();
    }
  }
  return parse(response) as Promise<T>;
}

// --- auth ---------------------------------------------------------------------------------------

export const auth = {
  async login(email: string, password: string) {
    storeSession(await api<Session>("/auth/login", { method: "POST", body: { email, password }, auth: false }));
  },
  register(email: string, password: string, firstName: string) {
    return api("/auth/register", {
      method: "POST",
      body: { email, password, first_name: firstName },
      auth: false,
    });
  },
  async verifyEmail(token: string) {
    storeSession(await api<Session>("/auth/verify-email", { method: "POST", body: { token }, auth: false }));
  },
  resendVerification(email: string) {
    return api("/auth/resend-verification", { method: "POST", body: { email }, auth: false });
  },
  forgotPassword(email: string) {
    return api("/auth/forgot-password", { method: "POST", body: { email }, auth: false });
  },
  resetPassword(token: string, password: string) {
    return api("/auth/reset-password", { method: "POST", body: { token, password }, auth: false });
  },
  async changePassword(currentPassword: string, newPassword: string) {
    storeSession(
      await api<Session>("/auth/change-password", {
        method: "POST",
        body: { current_password: currentPassword, new_password: newPassword },
      }),
    );
  },
  async logout() {
    try {
      await api("/auth/logout", { method: "POST", auth: false });
    } finally {
      accessToken = null;
    }
  },
};
