import type { PropsWithChildren } from "react";

import { Badge, Text } from "@/components/ui";

export type SurveyStepProps = PropsWithChildren<{
  section: string;
  question: string;
  hint?: string;
}>;

/** Question heading + content, sliding in whenever the step changes (key it by step). */
export function SurveyStep({ section, question, hint, children }: SurveyStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-[25px] duration-[220ms]">
      <div className="gap-5">
        <div className="gap-2">
          <Badge label={section} variant="primary" className="self-start" />
          <Text as="h2" variant="title">
            {question}
          </Text>
          {hint && <Text tone="muted">{hint}</Text>}
        </div>
        {children}
      </div>
    </div>
  );
}
