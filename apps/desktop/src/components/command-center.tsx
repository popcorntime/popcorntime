import { MediaKind } from "@popcorntime/graphql/types";
import { countries } from "@popcorntime/i18n";
import { Button } from "@popcorntime/ui/components/button";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from "@popcorntime/ui/components/command";
import { MediaPosterAsPicture } from "@popcorntime/ui/components/poster";
import { Skeleton } from "@popcorntime/ui/components/skeleton";
import Fuse from "fuse.js";
import { Film, MoveLeft, MoveRight, SearchIcon, TrendingUp, Tv, X } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useCountry } from "@/hooks/useCountry";
import { useSearch } from "@/hooks/useSearch";
import {
	type Command,
	type View as CommandCenterView,
	defaultCommands,
	type CommandGroup as ICommandGroup,
	useCommandCenterStore,
} from "@/stores/command-center";
import { useGlobalStore } from "@/stores/global";

function CommandCenterViewCountrySelection() {
	const { t } = useTranslation();
	const toggle = useCommandCenterStore(state => state.toggle);
	const { country } = useCountry();
	const navigate = useNavigate();

	const sortedCountries = useMemo(() => {
		return countries
			.filter(c => c !== country)
			.sort((a, b) => {
				const countryA = t(`country.${a}`);
				const countryB = t(`country.${b}`);
				return countryA.localeCompare(countryB);
			});
	}, [t, country]);

	const handleNavigation = useCallback(
		(path: string) => {
			navigate(path);
			toggle();
		},
		[navigate, toggle]
	);

	return (
		<CommandGroup heading="Quick Region">
			{sortedCountries.map(country => (
				<CommandItem
					key={country}
					onSelect={() => handleNavigation(`/browse/${country}`)}
					className="group gap-2"
				>
					<span className="flex w-6 justify-center">
						<span
							className={`fi fis fi-${country} h-4 w-4 rounded grayscale group-hover:grayscale-0`}
						/>
					</span>
					{t(`country.${country}`)}
				</CommandItem>
			))}
		</CommandGroup>
	);
}

function CommandCenterCommand({ command }: { command: Command }) {
	const { t } = useTranslation();
	const { country } = useCountry();
	const navigate = useNavigate();
	const toggle = useCommandCenterStore(state => state.toggle);
	const setQuery = useCommandCenterStore(state => state.setQuery);
	const goto = useCommandCenterStore(state => state.goto);

	const handleNavigation = useCallback(
		(path: string) => {
			navigate(path);
			toggle();
		},
		[toggle, navigate]
	);

	const handleOpenView = useCallback(
		(view: CommandCenterView) => {
			setQuery(undefined);
			goto(view);
		},
		[goto, setQuery]
	);

	switch (command.id) {
		case "main":
			return (
				<CommandItem key={command.id} value={command.id} onSelect={() => goto("main")}>
					<MoveLeft />
					<span>{t("commandCenter.home")}</span>
				</CommandItem>
			);

		case "populars":
			return (
				<CommandItem
					key={command.id}
					value={command.id}
					onSelect={() => {
						handleNavigation(`/browse/${country}`);
					}}
				>
					<TrendingUp />
					<span>{t("browse.populars")}</span>
				</CommandItem>
			);

		case "movies":
			return (
				<CommandItem
					key={command.id}
					value={command.id}
					onSelect={() => {
						handleNavigation(`/browse/${country}?kind=${MediaKind.MOVIE}`);
					}}
				>
					<Film />
					<span>{t("browse.movies")}</span>
				</CommandItem>
			);

		case "tv-shows":
			return (
				<CommandItem
					key={command.id}
					value={command.id}
					onSelect={() => {
						handleNavigation(`/browse/${country}?kind=${MediaKind.TV_SHOW}`);
					}}
				>
					<Tv />
					<span>{t("browse.tv-shows")}</span>
				</CommandItem>
			);

		case "change-region":
			return (
				<CommandItem
					onSelect={() => {
						handleOpenView("country-selection");
					}}
					className="group gap-2"
				>
					<span
						className={`fi fis fi-${country} h-4 w-4 rounded grayscale group-hover:grayscale-0`}
					/>
					{t(`country.${country}`)}
					<CommandShortcut className="ml-auto">
						<MoveRight />
					</CommandShortcut>
				</CommandItem>
			);
	}
}

function CommandCenterCommands() {
	const query = useCommandCenterStore(state => state.query);
	const view = useCommandCenterStore(state => state.view);

	const filterCommandGroups = useCallback(
		(groups: ICommandGroup[], search?: string): ICommandGroup[] => {
			const preFilteredGroups = groups
				.reduce((acc: ICommandGroup[], group) => {
					const filteredCommands = group.commands.filter(c => c.view !== view);

					if (filteredCommands.length) {
						acc.push({ label: group.label, commands: filteredCommands });
					}
					return acc;
				}, [])
				.filter(group => group.commands.length > 0);

			if (!search?.trim()) return preFilteredGroups;

			// fuse search
			return preFilteredGroups
				.reduce((acc: ICommandGroup[], group) => {
					// fuse this group
					const fuse = new Fuse(
						group.commands.filter(c => c.view !== view),
						{
							keys: ["label", "keywords"],
							threshold: 0.3,
						}
					);
					const filteredCommands = fuse.search(search).map(result => result.item);
					if (filteredCommands.length) {
						acc.push({ label: group.label, commands: filteredCommands });
					}
					return acc;
				}, [])
				.filter(group => group.commands.length);
		},
		[view]
	);

	const commands = useMemo(() => {
		return filterCommandGroups(defaultCommands, query);
	}, [query, filterCommandGroups]);

	if (!commands || commands.length === 0) return null;

	return (
		<>
			{commands.map((command, index) => (
				<CommandGroup
					key={`command-group-${
						// biome-ignore lint/suspicious/noArrayIndexKey: static
						index
					}`}
					heading={command.label}
				>
					{command.commands.map(c => (
						<CommandCenterCommand key={c.id} command={c} />
					))}
				</CommandGroup>
			))}
		</>
	);
}

function CommandCenterViewSearchResults() {
	const { t } = useTranslation();
	const query = useCommandCenterStore(state => state.query);
	const open = useGlobalStore(state => state.dialogs.media.open);
	const locale = useGlobalStore(state => state.i18n.locale);
	const sortKey = useGlobalStore(state => state.browse.sortKey);
	const { country } = useCountry();

	const { data, isLoading } = useSearch({
		country,
		query,
		limit: 20,
		cursor: undefined,
		language: locale,
		sortKey,
		enabled: !!query,
	});

	return (
		<CommandGroup>
			{isLoading &&
				Array.from({ length: 5 }).map((_, i) => (
					<CommandItem
						key={`loading-i-${
							// biome-ignore lint/suspicious/noArrayIndexKey: static
							i
						}`}
						className="m-2 cursor-pointer"
					>
						<Skeleton className="h-12 w-8 rounded-md" />
						<div className="flex flex-col space-y-2">
							<Skeleton className="h-4 w-[180px] rounded-md" />
							<Skeleton className="h-4 w-[80px] rounded-md" />
						</div>
					</CommandItem>
				))}

			{!isLoading &&
				data &&
				data.nodes.map(media => (
					<CommandItem
						className="m-2 cursor-pointer"
						onSelect={() => {
							open(media.slug);
						}}
						key={media.id}
						value={media.id.toString()}
					>
						<MediaPosterAsPicture
							loading="lazy"
							posterId={media.poster?.match(/\/([^/.]+)\./)?.[1]}
							title={media.title}
							className="w-8 rounded-md group-hover:scale-110 group-focus:scale-110"
						/>

						<div className="w-2/3">
							<div className="hover:text-accent-foreground truncate font-semibold whitespace-nowrap">
								{media.title}
							</div>
							<div className="hover:text-accent-foreground flex">
								<span>
									{media.kind === MediaKind.MOVIE ? t("media.movie") : t("media.tv-show")}
								</span>
								{media.year && <span>, {media.year}</span>}
							</div>
						</div>
					</CommandItem>
				))}

			{!isLoading && <CommandEmpty>{t("search.noResults")}</CommandEmpty>}
		</CommandGroup>
	);
}

export function CommandCenter() {
	const isOpen = useCommandCenterStore(state => state.isOpen);
	const toggle = useCommandCenterStore(state => state.toggle);
	const query = useCommandCenterStore(state => state.query);
	const setQuery = useCommandCenterStore(state => state.setQuery);
	const view = useCommandCenterStore(state => state.view);
	const goto = useCommandCenterStore(state => state.goto);
	const reset = useCommandCenterStore(state => state.reset);

	const { t } = useTranslation();

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				toggle();
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [toggle]);

	useEffect(() => {
		if (!isOpen) {
			reset();
		}
	}, [isOpen, reset]);

	const onClickClose = useCallback(() => {
		// if on search result, clear results
		if (query) {
			setQuery(undefined);
		} else {
			toggle();
		}
	}, [query, toggle, setQuery]);

	useEffect(() => {
		if (query && view !== "search-result") {
			goto("search-result");
		} else if (!query?.trim() && view === "search-result") {
			goto("main");
		}
	}, [query, view, goto]);

	const viewComponent = useMemo(() => {
		switch (view) {
			case "main":
				return undefined;
			case "search-result":
				return <CommandCenterViewSearchResults />;
			case "country-selection":
				return <CommandCenterViewCountrySelection />;
		}
	}, [view]);

	return (
		<>
			<Button
				variant="link"
				size="icon"
				className="text-muted-foreground hover:bg-muted z-[200] px-2"
				onClick={() => toggle()}
			>
				<SearchIcon className="size-8" />
			</Button>
			<CommandDialog
				modal
				open={isOpen}
				onKeyDown={e => {
					if (e.key === "Escape" || (e.key === "Backspace" && !query)) {
						e.preventDefault();
						onClickClose();
					}
				}}
				onOpenChange={toggle}
			>
				<div>
					<CommandInput
						placeholder={t("search.search")}
						value={query ?? ""}
						onValueChange={setQuery}
					/>
					<button
						type="button"
						onClick={onClickClose}
						className="ring-offset-background absolute top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none ltr:right-4 rtl:left-4"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				<CommandList>
					{viewComponent}
					<CommandCenterCommands />
				</CommandList>
			</CommandDialog>
		</>
	);
}
