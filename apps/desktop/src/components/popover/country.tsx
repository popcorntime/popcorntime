import { type Country, i18n } from "@popcorntime/i18n";
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

export function CountryPopover({
	size = "default",
	className,
	contentClassName,
	current,
	onSelect,
	countries = i18n.countries,
}: {
	className?: string;
	contentClassName?: string;
	current: Country;
	size?: ButtonProps["size"];
	onSelect: ((value: Country) => void) | undefined;
	countries?: Country[];
}) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	const sortedCountries = useMemo(() => {
		return countries.sort((a, b) => {
			const countryA = t(`country.${a.toLowerCase()}`);
			const countryB = t(`country.${b.toLowerCase()}`);
			return countryA.localeCompare(countryB);
		});
	}, [t, countries]);

	return (
		<Popover modal open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="link"
					role="combobox"
					size={size}
					className={cn(className, !current && "text-muted-foreground")}
					title={current ? capitalize(t(`country.${current.toLowerCase()}`)) : "Select country"}
				>
					{current ? capitalize(t(`country.${current.toLowerCase()}`)) : "Select country"}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn("pointer-events-auto p-0", contentClassName)}>
				<Command
					filter={(country, search) => {
						if (t(`country.${country.toLowerCase()}`).toLowerCase().includes(search.toLowerCase()))
							return 1;
						return 0;
					}}
				>
					<CommandInput placeholder={t("search.search")} />
					<CommandList>
						<CommandEmpty>{t("search.noResults")}</CommandEmpty>
						<CommandGroup>
							{sortedCountries.map(country => (
								<CommandItem
									value={country}
									content={t(`country.${country.toLowerCase()}`)}
									key={country}
									onSelect={country => {
										onSelect?.(country as Country);
										setOpen(false);
									}}
								>
									<Check
										className={cn("mr-2", country === current ? "opacity-100" : "opacity-0")}
									/>
									{capitalize(t(`country.${country.toLowerCase()}`))}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
