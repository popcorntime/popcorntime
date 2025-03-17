import { i18n, type Locale } from "@popcorntime/i18n";
import { Button, type ButtonProps } from "@popcorntime/ui/components/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@popcorntime/ui/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "@popcorntime/ui/components/popover";
import { cn } from "@popcorntime/ui/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { capitalize } from "@/utils/text";

export function LanguagePopover({
	size = "default",
	className,
	contentClassName,
	current,
	onSelect,
}: {
	className?: string;
	contentClassName?: string;
	current: Locale;
	size?: ButtonProps["size"];
	onSelect: ((value: Locale) => void) | undefined;
}) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	const sortedLocales = useMemo(() => {
		return i18n.locales.sort((a, b) => {
			const localeA = t(`language.${a}`);
			const localeB = t(`language.${b}`);
			return localeA.localeCompare(localeB);
		});
	}, [t]);

	return (
		<Popover modal open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					size={size}
					className={cn(className, !current && "text-muted-foreground")}
				>
					{current ? capitalize(t(`language.${current}`)) : "Select language"}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn("pointer-events-auto p-0", contentClassName)}>
				<Command
					filter={(locale, search) => {
						if (t(`language.${locale}`).toLowerCase().includes(search.toLowerCase())) return 1;
						return 0;
					}}
				>
					<CommandInput placeholder={t("search.search")} />
					<CommandList>
						<CommandEmpty>{t("search.noResults")}</CommandEmpty>
						<CommandGroup>
							{sortedLocales.map(locale => (
								<CommandItem
									value={locale}
									content={t(`language.${locale}`)}
									key={locale}
									onSelect={locale => {
										onSelect?.(locale as Locale);
										setOpen(false);
									}}
								>
									<Check className={cn("mr-2", locale === current ? "opacity-100" : "opacity-0")} />
									{capitalize(t(`language.${locale}`))}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
