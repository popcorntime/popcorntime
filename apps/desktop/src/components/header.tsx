import type { MediaKind } from "@popcorntime/graphql/types";
import { Button, buttonVariants } from "@popcorntime/ui/components/button";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarTrigger,
} from "@popcorntime/ui/components/menubar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@popcorntime/ui/components/tooltip";
import { cn } from "@popcorntime/ui/lib/utils";
import { appLogDir } from "@tauri-apps/api/path";
import { openPath } from "@tauri-apps/plugin-opener";
import {
	Bug,
	CircleUserIcon,
	Clapperboard,
	FileText,
	Film,
	Globe,
	Headphones,
	LogOut,
	StarsIcon,
	Tv,
} from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import { CommandCenter } from "@/components/command-center";
import { useCountry } from "@/hooks/useCountry";
import { useSession } from "@/hooks/useSession";
import { useGlobalStore } from "@/stores/global";

export function Header() {
	const favorites = useGlobalStore(state => state.providers.favorites);
	const { logout } = useSession();
	const preferFavorites = useGlobalStore(state => state.browse.preferFavorites);
	const togglePreferFavorites = useGlobalStore(state => state.browse.togglePreferFavorites);
	const openPreferences = useGlobalStore(state => state.dialogs.preferences.toggle);
	const openWatchPreferences = useGlobalStore(state => state.dialogs.watchPreferences.toggle);
	const direction = useGlobalStore(state => state.i18n.direction);

	const { country } = useCountry();
	const { t } = useTranslation();
	const { kind } = useParams<{
		kind: Lowercase<MediaKind>;
	}>();

	const openLogsDir = useCallback(async () => {
		const appLogDirPath = await appLogDir();
		console.log(appLogDirPath);
		openPath(appLogDirPath);
	}, []);

	return (
		<header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/90 fixed top-0 z-50 h-14 w-full overscroll-none border-b backdrop-blur select-none">
			<div className="macos:ml-20 mr-4 ml-4 flex h-full items-center">
				<div className="mx-auto grid w-full grid-cols-[auto_1fr_auto] items-center gap-2">
					<div className="z-[200] flex items-center gap-1">
						{/**
						 * Disabled for now, as it adds complexity
						 * <SidebarTrigger className={cn(kind === 'tv_show' && 'invisible')} />
						 */}

						{favorites.length > 0 && kind && (
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										data-sidebar="trigger"
										data-slot="sidebar-trigger"
										variant="link"
										className={cn(
											"text-muted-foreground hover:bg-muted hover:text-muted-foreground p-2",
											preferFavorites && "text-accent-foreground hover:text-accent-foreground"
										)}
										onClick={togglePreferFavorites}
									>
										<StarsIcon />
										<span className="sr-only">Toggle Sidebar</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent side="bottom" className="flex items-center gap-2 py-1 text-xs ">
									<Clapperboard className="h-3 w-3" />
									<span>For You feed</span>
								</TooltipContent>
							</Tooltip>
						)}
					</div>
					<nav className="z-[50] flex gap-4 justify-self-center rtl:space-x-reverse">
						<Link
							className={cn(
								buttonVariants({ variant: "link" }),
								kind === "movie" && "text-accent-foreground bg-accent",
								"flex gap-2"
							)}
							to={`/browse/${country}/movie`}
						>
							<Film className="h-4 w-4" />
							<span>{t("browse.movies")}</span>
						</Link>
						<Link
							className={cn(
								buttonVariants({ variant: "link" }),
								kind === "tv_show" && "text-accent-foreground bg-accent",
								"flex gap-2"
							)}
							to={`/browse/${country}/tv_show`}
						>
							<Tv className="h-4 w-4" />
							<span>{t("browse.tv-shows")}</span>
						</Link>
						<Tooltip>
							<TooltipTrigger asChild>
								<div>
									<Button variant="link" disabled className="flex gap-2">
										<Headphones className="h-4 w-4" />
										<span>Podcasts</span>
									</Button>
								</div>
							</TooltipTrigger>
							<TooltipContent className="text-xs" side="bottom">
								{t("header.soon")}
							</TooltipContent>
						</Tooltip>
					</nav>

					<div className="flex items-center gap-1 justify-self-end">
						<CommandCenter />

						<Menubar className="z-[200]">
							<MenubarMenu>
								<MenubarTrigger asChild>
									<Button
										title={t("preferences.preferences")}
										variant="link"
										size="icon"
										className="text-muted-foreground hover:bg-muted"
									>
										<CircleUserIcon className="size-8" />
									</Button>
								</MenubarTrigger>

								<MenubarContent align={direction === "ltr" ? "end" : "start"} className="z-[400]">
									<MenubarItem onClick={openPreferences} className="flex gap-2">
										<Globe className="size-4 shrink-0" />
										<span>{t("menu.preferences")}</span>
									</MenubarItem>
									<MenubarItem onClick={openWatchPreferences} className="flex gap-2">
										<Clapperboard className="size-4 shrink-0" />
										<span>{t("menu.watchPreferences")}</span>
									</MenubarItem>
									<MenubarItem asChild>
										<Link to="/onboarding/manifest?next=/" className="flex gap-2">
											<FileText className="size-4 shrink-0" />
											<span>{t("menu.manifest")}</span>
										</Link>
									</MenubarItem>
									<MenubarSeparator />
									<MenubarItem onClick={openLogsDir} className="flex gap-2">
										<Bug className="size-4 shrink-0" />
										<span>{t("menu.logs")}</span>
									</MenubarItem>
									<MenubarItem onClick={logout} className="flex gap-2">
										<LogOut className="size-4 shrink-0" />
										<span>{t("menu.signOut")}</span>
									</MenubarItem>
								</MenubarContent>
							</MenubarMenu>
						</Menubar>
					</div>
				</div>
			</div>
			<div className="absolute top-0 left-0 z-40 h-14 w-full" data-tauri-drag-region></div>
		</header>
	);
}
