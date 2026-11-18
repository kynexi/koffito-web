import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/lib/cn";

// shadcn/ui Switch, sized and colored like the app's themed switch on web:
// 40×20 hit area, 40×14 rounded track (primary when on, border color when off)
// and a 20×20 surface-colored thumb with a small shadow.
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "group peer relative h-5 w-10 shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
    ref={ref}>
    <span className="absolute inset-x-0 top-[3px] h-[14px] rounded-[10px] transition-colors duration-100 group-data-[state=checked]:bg-primary group-data-[state=unchecked]:bg-border" />
    <SwitchPrimitives.Thumb className="pointer-events-none absolute left-0 top-0 block h-5 w-5 rounded-full bg-surface shadow-[0px_1px_3px_rgba(0,0,0,0.5)] transition-transform duration-100 data-[state=checked]:translate-x-5" />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
