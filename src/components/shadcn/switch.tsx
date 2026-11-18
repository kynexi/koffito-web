import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/lib/cn";

// shadcn/ui Switch in the warm palette: primary track when on, border-colored when off,
// surface-colored thumb (same colors as the app's themed RN Switch).
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-[31px] w-[51px] shrink-0 cursor-pointer flex-row items-center rounded-full p-0.5 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-border",
      className,
    )}
    {...props}
    ref={ref}>
    <SwitchPrimitives.Thumb className="pointer-events-none block h-[27px] w-[27px] rounded-full bg-surface shadow-soft transition-transform duration-200 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
