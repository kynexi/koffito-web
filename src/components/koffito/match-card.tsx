import { useState } from "react";

import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";
import type { Match } from "@/types/koffito";
import { InterestChip } from "./interest-chip";

export type MatchCardProps = {
  match: Match;
  onConnect?: () => void;
  onPass?: () => void;
  connectLabel?: string;
  connecting?: boolean;
};

const PHOTO_HEIGHT = 300;

export function MatchCard({
  match,
  onConnect,
  onPass,
  connectLabel = "Let's grab coffee",
  connecting = false,
}: MatchCardProps) {
  const { user, sharedInterests, distance } = match;
  // Bumping the key replays the coffee-cup pulse (grow in, then fade away).
  const [pulses, setPulses] = useState(0);

  const handleConnect = () => {
    setPulses((value) => value + 1);
    onConnect?.();
  };

  return (
    <div className="animate-in fade-in slide-in-from-top-[25px] duration-300">
      <Card padding="none" className="overflow-hidden">
        <div style={{ height: PHOTO_HEIGHT }} className="bg-secondary">
          {user.emoji ? (
            <div className="flex-1 items-center justify-center">
              <Text className="text-[64px] leading-[76px]">{user.emoji}</Text>
            </div>
          ) : (
            <div className="flex-1 items-center justify-center">
              <Avatar name={user.name} size="xl" />
            </div>
          )}

          <div
            style={{ backgroundImage: "linear-gradient(180deg, rgba(42,26,16,0) 40%, rgba(42,26,16,0.75) 100%)" }}
            className="absolute inset-0 justify-end p-5">
            <Text variant="title" className="text-white">
              {user.age ? `${user.name}, ${user.age}` : user.name}
            </Text>
            {(distance || user.location) && (
              <Text variant="caption" className="text-white/85">
                📍 {distance ?? user.location}
              </Text>
            )}
          </div>

          <div
            key={pulses}
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 items-center justify-center opacity-0",
              pulses > 0 && "animate-[koffito-cup-pulse_620ms_ease-out]",
            )}>
            <Text className="text-[72px] leading-[88px]">☕</Text>
          </div>
        </div>

        <div className="gap-4 p-5">
          {user.bio && (
            <Text tone="muted" numberOfLines={3}>
              {user.bio}
            </Text>
          )}

          {sharedInterests.length > 0 && (
            <div className="gap-2">
              <Text variant="caption" tone="muted">
                You both love
              </Text>
              <div className="flex-row flex-wrap gap-2">
                {sharedInterests.map((interest) => (
                  <InterestChip key={interest} interest={interest} size="sm" selected />
                ))}
              </div>
            </div>
          )}

          <div className="flex-row items-center gap-3">
            {onPass && (
              <IconButton icon="close" aria-label={`Pass on ${user.name}`} size="lg" onClick={onPass} />
            )}
            <div className="flex-1">
              <Button
                title={connectLabel}
                leftIcon="cafe"
                size="lg"
                fullWidth
                loading={connecting}
                onClick={handleConnect}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
