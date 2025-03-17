import { Badge } from "@popcorntime/ui/components/badge";
import { Button } from "@popcorntime/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@popcorntime/ui/components/dialog";
import { ScrollArea } from "@popcorntime/ui/components/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@popcorntime/ui/components/table";
import { cn } from "@popcorntime/ui/lib/utils";
import { BookmarkMinusIcon, BookmarkPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useProviders } from "@/hooks/useProviders";
import { useGlobalStore } from "@/stores/global";
import { ProviderIcon } from "../provider";

export function WatchPreferencesDialog() {
	const providers = useGlobalStore(state => state.providers.providers);
	const favorites = useGlobalStore(state => state.providers.favorites);
	const isOpen = useGlobalStore(state => state.dialogs.watchPreferences.isOpen);
	const toggle = useGlobalStore(state => state.dialogs.watchPreferences.toggle);
	const { addToFavorites, removeFromFavorites } = useProviders();
	const { t } = useTranslation();

	return (
		<Dialog open={isOpen} onOpenChange={toggle}>
			<DialogContent className="z-[300] h-full w-full max-w-2xl border-0 outline-none md:max-h-[90vh] lg:max-w-4xl">
				<div
					className={cn(
						"flex min-h-[calc(100vh-(12rem))] flex-col transition-all duration-300",
						"translate-y-0 opacity-100",
						"ease-[cubic-bezier(0.25, 1, 0.5, 1)]"
					)}
				>
					<DialogHeader>
						<DialogTitle>{t("watchPreferences.label")}</DialogTitle>
						<DialogDescription>{t("watchPreferences.description")}</DialogDescription>
					</DialogHeader>

					<ScrollArea className="grid h-full min-h-0 flex-1 gap-4 overflow-hidden rounded py-4">
						<Table>
							<TableBody>
								{providers.map(provider => {
									const isFavorite = favorites.find(f => f.key === provider.key);
									return (
										<TableRow
											key={provider.key}
											className={cn(
												"border-gray-700/30 transition-colors hover:bg-gray-800/40",
												isFavorite && "bg-accent"
											)}
										>
											<TableCell className="py-4">
												<div className="flex items-center gap-3">
													<ProviderIcon className="flex size-10 rounded-lg" icon={provider.logo} />

													<span className="font-medium">{provider.name}</span>
												</div>
											</TableCell>
											<TableCell className="max-w-[20vw] align-middle">
												<div className="flex flex-wrap items-center gap-2">
													{provider.priceTypes?.map(type => (
														<Badge
															key={type}
															variant="outline"
															className="border-current/30 bg-current/10"
														>
															{t(`priceType.${type.toLowerCase()}`)}
														</Badge>
													))}
												</div>
											</TableCell>

											<TableCell className="text-right">
												{isFavorite ? (
													<Button
														variant="outline"
														size="icon"
														onClick={() => {
															removeFromFavorites(provider.key);
														}}
													>
														<BookmarkMinusIcon />
													</Button>
												) : (
													<Button
														variant="outline"
														size="icon"
														onClick={() => {
															addToFavorites(provider.key);
														}}
													>
														<BookmarkPlus />
													</Button>
												)}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</ScrollArea>
				</div>
			</DialogContent>
		</Dialog>
	);
}
