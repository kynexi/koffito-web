import { type InputHTMLAttributes, type ReactNode, type Ref, useId, useState } from "react";

import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./icon";
import { Text } from "./text";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement & HTMLTextAreaElement>, "onChange"> & {
  label?: string;
  helperText?: string;
  /** Error message; also switches the field to its error style. */
  error?: string;
  leftIcon?: IconName;
  rightElement?: ReactNode;
  /** Classes for the rounded field container (e.g. `rounded-full`). */
  fieldClassName?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  /** Called when Enter is pressed (single-line fields). */
  onSubmitEditing?: () => void;
  /** Hide the typed characters, with a show/hide toggle. */
  secureTextEntry?: boolean;
  multiline?: boolean;
  /** Visible rows for multiline fields. */
  numberOfLines?: number;
  ref?: Ref<HTMLInputElement & HTMLTextAreaElement>;
};

export function Input({
  label,
  helperText,
  error,
  leftIcon,
  rightElement,
  secureTextEntry,
  multiline = false,
  numberOfLines,
  disabled,
  fieldClassName,
  className,
  onChangeText,
  onSubmitEditing,
  onFocus,
  onBlur,
  onKeyDown,
  type = "text",
  id,
  ref,
  ...rest
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const shared = {
    ref,
    id: inputId,
    disabled,
    "aria-label": label ? undefined : (rest.placeholder ?? undefined),
    "aria-invalid": error ? true : undefined,
    onChange: (event: { target: { value: string } }) => onChangeText?.(event.target.value),
    onFocus: (event: React.FocusEvent<HTMLInputElement & HTMLTextAreaElement>) => {
      setFocused(true);
      onFocus?.(event);
    },
    onBlur: (event: React.FocusEvent<HTMLInputElement & HTMLTextAreaElement>) => {
      setFocused(false);
      onBlur?.(event);
    },
    className: "flex-1 py-3 font-body text-base leading-6 text-foreground caret-primary",
    spellCheck: type === "email" || type === "url" || secureTextEntry ? false : undefined,
    ...rest,
  };

  return (
    <div className={cn("gap-1.5", className)}>
      {label && (
        <Text as="label" htmlFor={inputId} variant="label" className="ml-1">
          {label}
        </Text>
      )}

      <div
        className={cn(
          "min-h-14 flex-row items-center gap-2.5 rounded-2xl border-2 border-transparent bg-surface-muted px-4 transition-colors",
          focused && "border-primary/50 bg-surface",
          !!error && "border-error/60",
          disabled && "opacity-60",
          fieldClassName,
        )}>
        {leftIcon && <Icon name={leftIcon} size={20} color={focused ? "primary" : "muted"} />}

        {multiline ? (
          <textarea rows={numberOfLines ?? 4} {...shared} className={cn(shared.className, "resize-none")} />
        ) : (
          <input
            type={secureTextEntry && hidden ? "password" : secureTextEntry ? "text" : type}
            onKeyDown={(event) => {
              if (event.key === "Enter") onSubmitEditing?.();
              onKeyDown?.(event as React.KeyboardEvent<HTMLInputElement & HTMLTextAreaElement>);
            }}
            {...shared}
          />
        )}

        {secureTextEntry && (
          <button
            type="button"
            aria-label={hidden ? "Show password" : "Hide password"}
            className="before:absolute before:-inset-2.5 before:content-['']"
            onClick={() => setHidden((value) => !value)}>
            <Icon name={hidden ? "eye-outline" : "eye-off-outline"} size={20} color="muted" />
          </button>
        )}
        {rightElement}
      </div>

      {(error || helperText) && (
        <Text variant="caption" tone={error ? "error" : "muted"} className="ml-1" role={error ? "alert" : undefined}>
          {error ?? helperText}
        </Text>
      )}
    </div>
  );
}
