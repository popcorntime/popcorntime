import { type Availability, WatchPriceType } from "@popcorntime/graphql/types";
import { cn } from "@popcorntime/ui/lib/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import emptyProvider from "@/assets/provider.svg";

export function ProviderIcon({
	icon,
	className,
	alt,
}: {
	alt?: string;
	icon?: string | null;
	className?: string;
}) {
	const posterId = useMemo(() => {
		// `/ID.jpg` is the original poster
		if (icon) {
			return icon.match(/\/([^/.]+)\./)?.[1];
		}
	}, [icon]);

	if (!posterId) {
		return (
			<img
				src={emptyProvider}
				alt={alt || ""}
				width={64}
				height={64}
				className={cn(
					"relative bg-gradient-to-b from-slate-700/20 to-slate-900 p-4 shadow-md transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-slate-700/20",
					className
				)}
			/>
		);
	}

	return (
		<picture>
			<source srcSet={`https://img.popcorntime.app/o/${posterId}.webp`} type="image/webp" />
			<img
				alt={alt}
				src={`https://img.popcorntime.app/o/${posterId}.jpg`}
				className={cn(
					"relative bg-gradient-to-b from-slate-700/20 to-slate-900 shadow-md transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-slate-700/20",
					className
				)}
			/>
		</picture>
	);
}

export function ProviderText({ availability }: { availability: Availability }) {
	const { t } = useTranslation();
	const translateKey = useMemo(() => {
		if (
			availability.pricesType?.includes(WatchPriceType.BUY) &&
			availability.pricesType?.includes(WatchPriceType.RENT)
		) {
			return "buy-rent-on";
		}

		if (availability.pricesType?.includes(WatchPriceType.BUY)) {
			return "buy-on";
		}

		if (availability.pricesType?.includes(WatchPriceType.FREE)) {
			return "free-on";
		}

		if (availability.pricesType?.includes(WatchPriceType.RENT)) {
			return "rent-on";
		}

		return "watch-on";
	}, [availability.pricesType]);

	return (
		<>
			{t(`mediaQuickActions.${translateKey}`, {
				platform: availability.providerName,
			})}
		</>
	);
}
