import { useLocation, useNavigate } from "react-router";

import { TabBar, type TabBarItem } from "@/components/ui";

/** Tabs shown in the floating bar, keyed by their path. */
const tabs: TabBarItem[] = [
  { key: "/", label: "Home", icon: "home-outline", activeIcon: "home" },
  { key: "/events", label: "Events", icon: "cafe-outline", activeIcon: "cafe" },
  { key: "/profile", label: "Profile", icon: "person-outline", activeIcon: "person" },
];

/** The floating Koffito `TabBar`, driven by the current URL. */
export function AppTabBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 items-center">
      <TabBar
        items={tabs}
        activeKey={pathname}
        onChange={(key) => {
          if (key !== pathname) navigate(key);
        }}
        className="pointer-events-auto w-[232px] max-w-full"
      />
    </nav>
  );
}
