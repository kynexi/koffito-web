
import { Text } from "@/components/ui";

export type AuthHeroProps = {
  emoji?: string;
  title: string;
  subtitle: string;
  size?: "md" | "lg";
};

/** Emoji badge + title block shared by the welcome and auth screens. */
export function AuthHero({ emoji = "☕", title, subtitle, size = "md" }: AuthHeroProps) {
  const large = size === "lg";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-[25px] duration-300">
      <div className="items-center gap-4">
        <div
          className={
            large
              ? "h-36 w-36 items-center justify-center rounded-full bg-secondary"
              : "h-20 w-20 items-center justify-center rounded-full bg-secondary"
          }>
          <Text className={large ? "text-[64px] leading-[80px]" : "text-[36px] leading-[48px]"}>{emoji}</Text>
        </div>
        <div className="items-center gap-2">
          <Text as="h1" variant={large ? "display" : "title"} className="text-center">
            {title}
          </Text>
          <Text tone="muted" className="max-w-xs text-center">
            {subtitle}
          </Text>
        </div>
      </div>
    </div>
  );
}
