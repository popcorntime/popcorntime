import { MediaKind, MediaSearch, SortKey } from "@popcorntime/graphql/types";
import { PosterSkeleton, Poster } from "@popcorntime/ui/components/poster";
import { Button } from "@popcorntime/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@popcorntime/ui/components/popover";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@popcorntime/ui/components/toggle-group";
import { cn } from "@popcorntime/ui/lib/utils";
import { Check, SlidersHorizontal } from "lucide-react";
import { useMemo } from "react";

interface BrowseSortByProps {
  sortKeys: {
    key: SortKey;
    label: string;
    current: boolean;
  }[];
  onSortChange(sortKey: SortKey): void;
  translations: {
    sortBy: string;
  };
}

export function BrowseSortBy({
  sortKeys,
  onSortChange,
  translations,
}: BrowseSortByProps) {
  const sortKey = useMemo(
    () => sortKeys.find((s) => s.current)?.key ?? SortKey.POSITION,
    [sortKeys]
  );
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="bg-background/70 hover:bg-background pointer-events-auto h-8 rounded-full px-3 shadow backdrop-blur"
          aria-label="Sort"
          title="Sort (S)"
        >
          <SlidersHorizontal className="mr-2 size-4" />
          <span className="hidden sm:inline">{translations.sortBy}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-fit">
        <ToggleGroup
          type="single"
          value={sortKey}
          onValueChange={(v) => v && onSortChange(v as SortKey)}
          className="grid grid-cols-2"
        >
          {sortKeys.map((s) => (
            <ToggleGroupItem
              variant="outline"
              size="sm"
              key={s.key}
              value={s.key}
              className="justify-start text-xs"
              aria-label={s.label}
            >
              <Check
                className={`mr-2 size-4 ${sortKey === s.key ? "opacity-100" : "opacity-0"}`}
              />
              {s.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  );
}

interface BrowseMediasProps {
  sentryRef: React.Ref<HTMLDivElement> | undefined;
  isLoading: boolean;
  isReady: boolean;
  medias: MediaSearch[];
  onOpen(slug: string): void;
  onLoadMore(): void;
  placeholder: string;
  translations: {
    loading: string;
    loadMore: string;
    sortBy: string;
    free: string;
    kind: {
      movie: string;
      tvShow: string;
    };
  };
}

export function BrowseMedias({
  isLoading,
  isReady,
  medias,
  onOpen,
  placeholder,
  translations,
  onLoadMore,
  sentryRef,
  onSortChange,
  sortKeys,
}: BrowseMediasProps & BrowseSortByProps) {
  return (
    <div className="h-full w-full overflow-y-auto">
      <ul className="grid grid-cols-4 md:md:grid-cols-5 lg:md:grid-cols-6 xl:md:grid-cols-7 2xl:md:grid-cols-10">
        {!isReady && medias.length === 0
          ? Array.from({ length: 50 }).map((_, i) => (
              <li
                key={`skeleton-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                  i
                }`}
              >
                <PosterSkeleton />
              </li>
            ))
          : medias.map((media) => (
              <li key={media.id}>
                <button
                  type="button"
                  onClick={() => onOpen(media.slug)}
                  className="block h-full w-full appearance-none border-0 bg-transparent p-0 text-left leading-none rtl:text-right"
                >
                  <Poster
                    media={media}
                    placeholder={placeholder}
                    translations={{
                      free: translations.free,
                      kind:
                        media.kind === MediaKind.MOVIE
                          ? translations.kind.movie
                          : translations.kind.tvShow,
                    }}
                  />
                </button>
              </li>
            ))}
      </ul>

      <div className="pointer-events-none fixed top-15 right-3 z-50">
        <BrowseSortBy translations={{sortBy: translations.sortBy}} onSortChange={onSortChange} sortKeys={sortKeys} />
      </div>

      <div className="relative" ref={sentryRef}>
        <div className="mt-8 flex justify-center">
          <Button
            disabled={isLoading}
            className={cn("mx-4 block", medias.length === 0 && "hidden")}
            variant="link"
            size="sm"
            onClick={onLoadMore}
          >
            {isLoading ? translations.loading : translations.loadMore}
          </Button>
        </div>
      </div>
    </div>
  );
}
