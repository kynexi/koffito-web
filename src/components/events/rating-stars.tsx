
import { Icon } from "@/components/ui";

export type RatingStarsProps = {
  value: number;
  /** Omit for a read-only rating. */
  onChange?: (value: number) => void;
  size?: number;
};

const stars = [1, 2, 3, 4, 5];

export function RatingStars({ value, onChange, size = 36 }: RatingStarsProps) {
  return (
    <div role={onChange ? "radiogroup" : "img"} aria-label={`${value} out of 5 stars`} className="flex-row gap-1.5">
      {stars.map((star) => (
        <button type="button"
          key={star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          disabled={!onChange}
          onClick={() => onChange?.(star)}>
          <Icon name={star <= value ? "star" : "star-outline"} size={size} color={star <= value ? "warning" : "border"} />
        </button>
      ))}
    </div>
  );
}
