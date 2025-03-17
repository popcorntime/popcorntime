import { useMemo } from "react";
import { cn } from "@popcorntime/ui/lib/utils";
import { MediaSearch, WatchPriceType } from "@popcorntime/graphql/types";

export function PosterSkeleton() {
  return (
    <div className="group relative h-full w-full rounded-xs border border-transparent">
      <div className="aspect-[2/3] w-full overflow-hidden rounded-xs">
        <div className="h-full w-full animate-pulse bg-muted/60" />
      </div>
    </div>
  );
}

export function Poster({
  media,
  placeholder,
  isAboveTheFold = false,
  translations,
}: {
  isAboveTheFold?: boolean;
  placeholder?: string;
  media: MediaSearch;
  translations: {
    free: string;
    kind: string;
  };
}) {
  const isProbablyFree = useMemo(() => {
    if (media.providers) {
      return (
        media.providers.find((provider) =>
          provider.priceTypes.includes(WatchPriceType.FREE)
        ) !== undefined
      );
    }

    return false;
  }, [media]);

  const posterId = useMemo(() => {
    // `/ID.jpg` is the original poster
    if (media.poster) {
      return media.poster.match(/\/([^/.]+)\./)?.[1];
    }
  }, [media.poster]);

  return (
    <div className="group relative w-full rounded-xs border border-border h-full">
      <div className="absolute -inset-px rounded-xs border-2 border-transparent opacity-0 [--quick-links-hover-bg:theme(colors.slate.800)] [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.slate.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100" />
      <div className="relative overflow-hidden rounded-xs h-full">
        {isProbablyFree && (
          <div className="absolute right-0 top-0 h-16 w-20">
            <div className="absolute -right-12 top-4 w-40 rotate-45 transform bg-[#e54b3f] py-1 text-center text-sm font-bold uppercase tracking-tighter text-white shadow-md">
              {translations.free}
            </div>
          </div>
        )}

        <MediaPosterAsPicture
          loading={isAboveTheFold ? "eager" : "lazy"}
          title={media.title}
          posterId={posterId}
          placeholder={placeholder}
        />

        {media.overview && (
          <div className="absolute inset-0 bg-slate-900/80 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="text-3xl font-extrabold tracking-tight">
              {translations.kind}
            </div>
            <p className="lg:line-clamp-8 mt-2 line-clamp-[10] text-sm tracking-tight sm:line-clamp-4 md:line-clamp-6 xl:line-clamp-4 2xl:line-clamp-6 portrait:line-clamp-5">
              {media.overview}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function MediaPosterAsPicture({
  posterId,
  loading,
  className,
  title,
  placeholder,
}: {
  posterId?: string;
  loading: "lazy" | "eager";
  className?: string;
  title: string;
  placeholder?: string;
}) {
  if (!posterId) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={placeholder}
          alt={title}
          loading={loading}
          className={cn("w-full bg-cover", className)}
        />
      </div>
    );
  }

  return (
    <>
      <picture>
        <source
          srcSet={`https://img.popcorntime.app/o/${posterId}@300.webp`}
          type="image/webp"
        />
        <source
          srcSet={`https://img.popcorntime.app/o/${posterId}@300.jpg`}
          type="image/jpeg"
        />
        <img
          alt={title}
          src={`https://img.popcorntime.app/o/${posterId}@300.jpg`}
          className={cn("w-full bg-cover", className)}
          loading={loading}
          fetchPriority={loading === "eager" ? "high" : undefined}
        />
      </picture>
    </>
  );
}
