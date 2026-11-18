import { Icon } from "./icon";
import { Input, type InputProps } from "./input";

export type SearchInputProps = Omit<
  InputProps,
  "label" | "leftIcon" | "rightElement" | "secureTextEntry" | "value" | "onChangeText"
> & {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
};

export function SearchInput({ value, onChangeText, onClear, placeholder = "Search", ...rest }: SearchInputProps) {
  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      leftIcon="search"
      type="search"
      enterKeyHint="search"
      autoCorrect="off"
      fieldClassName="rounded-full"
      rightElement={
        value.length > 0 ? (
          <button
            type="button"
            aria-label="Clear search"
            className="animate-in fade-in duration-150 before:absolute before:-inset-2.5 before:content-['']"
            onClick={() => {
              onChangeText("");
              onClear?.();
            }}>
            <Icon name="close-circle" size={20} color="muted" />
          </button>
        ) : null
      }
      {...rest}
    />
  );
}
