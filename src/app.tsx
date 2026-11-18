import { useEffect } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate } from "react-router";

import { AppTabBar } from "@/components/navigation/app-tab-bar";
import { ToastProvider } from "@/components/ui/toast";
import { EventsProvider } from "@/context/events";
import { SessionProvider, useSession } from "@/context/session";
import { setNavigate } from "@/lib/router";

import AdminScreen from "./app/(app)/admin";
import ChangePasswordScreen from "./app/(app)/change-password";
import ComponentsScreen from "./app/(app)/components";
import CreateEventScreen from "./app/(app)/create-event";
import EventDetailsScreen from "./app/(app)/event-details";
import FindCoffeeTalkScreen from "./app/(app)/find-coffee-talk";
import PersonScreen from "./app/(app)/person";
import ReportScreen from "./app/(app)/report";
import SettingsScreen from "./app/(app)/settings";
import SurveyScreen from "./app/(app)/survey";
import SurveyProfileSettingsScreen from "./app/(app)/survey-profile-settings";
import CheckEmailScreen from "./app/(auth)/check-email";
import ForgotPasswordScreen from "./app/(auth)/forgot-password";
import LoginScreen from "./app/(auth)/login";
import RegisterScreen from "./app/(auth)/register";
import ResetPasswordScreen from "./app/(auth)/reset-password";
import VerifyEmailScreen from "./app/(auth)/verify-email";
import WelcomeScreen from "./app/(auth)/welcome";
import EventsScreen from "./app/(tabs)/events";
import HomeScreen from "./app/(tabs)/index";
import ProfileScreen from "./app/(tabs)/profile";
import DevScreen from "./app/dev";

export function App() {
  return (
    <BrowserRouter>
      <RouterBridge />
      <ToastProvider>
        <SessionProvider>
          <EventsProvider>
            <AppRoutes />
          </EventsProvider>
        </SessionProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

/** Lets plain modules call `router.push(...)` (see lib/router). */
function RouterBridge() {
  const navigate = useNavigate();
  useEffect(() => setNavigate(navigate), [navigate]);
  return null;
}

function AppRoutes() {
  const { isLoading } = useSession();

  if (isLoading) return null;

  return (
    <Routes>
      {/* Signed-in area */}
      <Route element={<Protected signedIn />}>
        <Route element={<TabsLayout />}>
          <Route index element={<HomeScreen />} />
          <Route path="events" element={<EventsScreen />} />
          <Route path="profile" element={<ProfileScreen />} />
        </Route>
        <Route path="find-coffee-talk" element={<FindCoffeeTalkScreen />} />
        <Route path="event-details" element={<EventDetailsScreen />} />
        <Route path="report" element={<ReportScreen />} />
        <Route path="person" element={<PersonScreen />} />
        <Route path="settings" element={<SettingsScreen />} />
        <Route path="survey-profile-settings" element={<SurveyProfileSettingsScreen />} />
        <Route path="survey" element={<SurveyScreen />} />
        <Route path="change-password" element={<ChangePasswordScreen />} />
        <Route element={<AdminOnly />}>
          <Route path="admin" element={<AdminScreen />} />
          <Route path="create-event" element={<CreateEventScreen />} />
        </Route>
        <Route path="components" element={<ComponentsScreen />} />
      </Route>

      {/* Signed-out area */}
      <Route element={<Protected signedIn={false} />}>
        <Route path="welcome" element={<WelcomeScreen />} />
        <Route path="login" element={<LoginScreen />} />
        <Route path="register" element={<RegisterScreen />} />
        <Route path="check-email" element={<CheckEmailScreen />} />
        <Route path="forgot-password" element={<ForgotPasswordScreen />} />
      </Route>

      {/* Opened from email links, so they work whether or not someone is signed in here. */}
      <Route path="verify-email" element={<VerifyEmailScreen />} />
      <Route path="reset-password" element={<ResetPasswordScreen />} />

      {/* DEV ONLY — unguarded jump menu, reachable in either session state. */}
      <Route path="dev" element={<DevScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/** Same guards as the app's `Stack.Protected`: wrong session state bounces to the other area. */
function Protected({ signedIn }: { signedIn: boolean }) {
  const { session } = useSession();

  if (signedIn && !session) return <Navigate to="/welcome" replace />;
  if (!signedIn && session) return <Navigate to="/" replace />;
  return <Outlet />;
}

/** Admin screens; the API enforces this too — this only keeps others from seeing an empty page. */
function AdminOnly() {
  const { isAdmin } = useSession();
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}

function TabsLayout() {
  return (
    <>
      <Outlet />
      <AppTabBar />
    </>
  );
}
