
import { Text } from "@/components/ui";

export type AuthSwitchLinkProps = {
  prompt: string;
  actionLabel: string;
  onClick: () => void;
};

/** "Don't have an account? Register" style link under auth forms. */
export function AuthSwitchLink({ prompt, actionLabel, onClick }: AuthSwitchLinkProps) {
  return (
    <button type="button" role="link" onClick={onClick} className="self-center py-2">
      <Text tone="muted">
        {prompt}{" "}
        <Text variant="label" tone="primary">
          {actionLabel}
        </Text>
      </Text>
    </button>
  );
}
