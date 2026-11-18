import { router } from "@/lib/router";

import { AuthHero } from "@/components/auth/auth-hero";
import { Screen } from "@/components/layout";
import { Badge, Button } from "@/components/ui";

const highlights = [
  { label: "Meet coffee lovers", icon: "people-outline" },
  { label: "Discover great cafés", icon: "cafe-outline" },
  { label: "Blind coffee talks", icon: "sparkles-outline" },
] as const;

export default function WelcomePage() {
  return (
    <Screen
      contentClassName="flex-1 justify-center gap-8"
      footer={
        <>
          <Button title="Get started" size="lg" fullWidth rightIcon="arrow-forward" onClick={() => router.push("/register")} />
          <Button title="I already have an account" variant="ghost" fullWidth onClick={() => router.push("/login")} />
        </>
      }>
      <AuthHero
        size="lg"
        title="Welcome to Koffito"
        subtitle="A place where you can meet fellow coffee lovers and discover the best coffee in town."
      />
      <div className="flex-row flex-wrap justify-center gap-2">
        {highlights.map((item) => (
          <Badge key={item.label} label={item.label} icon={item.icon} variant="primary" />
        ))}
      </div>
    </Screen>
  );
}
