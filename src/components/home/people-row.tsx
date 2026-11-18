
import { Avatar, Icon, Text } from "@/components/ui";
import type { User } from "@/types/koffito";

export type PeopleRowProps = {
  people: User[];
  onSelect: (user: User) => void;
  onDiscoverMore: () => void;
};

/** Horizontally scrolling faces, ending in a "Discover more" bubble. */
export function PeopleRow({ people, onSelect, onDiscoverMore }: PeopleRowProps) {
  return (
    <div className="-mx-5 flex-row overflow-x-auto no-scrollbar gap-4 px-5 py-1">
      {people.map((person) => (
        <button type="button"
          key={person.id}
          aria-label={`View ${person.name}`}
          onClick={() => onSelect(person)}
          className="w-[72px] items-center gap-2">
          <Avatar name={person.name} emoji={person.emoji} size="lg" status={person.isOnline ? "online" : undefined} />
          <Text variant="caption" numberOfLines={1}>
            {person.name.split(" ")[0]}
          </Text>
        </button>
      ))}

      <button type="button" onClick={onDiscoverMore} className="w-[72px] items-center gap-2">
        <div className="h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-primary/40 bg-secondary/40">
          <Icon name="add" size={28} color="primary" />
        </div>
        <Text variant="caption" tone="primary" numberOfLines={1}>
          Discover
        </Text>
      </button>
    </div>
  );
}
