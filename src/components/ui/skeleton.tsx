import { cn } from "@/lib/cn";

export type SkeletonProps = {
  shape?: "rect" | "circle";
  width?: number | string;
  height?: number | string;
  className?: string;
};

/** Soft pulsing placeholder while content loads. */
export function Skeleton({ shape = "rect", width = "100%", height = 16, className }: SkeletonProps) {
  return (
    <div
      aria-hidden
      style={{ width, height: shape === "circle" ? width : height }}
      className={cn(
        "animate-pulse-soft bg-surface-muted",
        shape === "circle" ? "rounded-full" : "rounded-xl",
        className,
      )}
    />
  );
}

export type SkeletonTextProps = {
  lines?: number;
  className?: string;
};

/** Paragraph placeholder; the last line is shorter to look like real text. */
export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn("gap-2", className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} height={12} width={index === lines - 1 && lines > 1 ? "60%" : "100%"} />
      ))}
    </div>
  );
}
