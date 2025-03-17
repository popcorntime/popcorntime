import { zodResolver } from "@hookform/resolvers/zod";
import { type Country, i18n, type Locale } from "@popcorntime/i18n";
import { Button } from "@popcorntime/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@popcorntime/ui/components/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@popcorntime/ui/components/form";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { useShallow } from "zustand/shallow";
import { CountryPopover } from "@/components/popover/country";
import { LanguagePopover } from "@/components/popover/language";
import { useCountry } from "@/hooks/useCountry";
import { useSession } from "@/hooks/useSession";
import { useUpdater } from "@/hooks/useUpdater";
import { useGlobalStore } from "@/stores/global";

const accountFormSchema = z.object({
	country: z.enum([...i18n.countries] as [Country, ...Country[]]),
	language: z.enum([...i18n.locales] as [Locale, ...Locale[]]),
});
type AccountFormValues = z.infer<typeof accountFormSchema>;

export function PreferencesDialog() {
	const shouldOpen = useGlobalStore(state => state.dialogs.preferences.isOpen);
	const toggle = useGlobalStore(state => state.dialogs.preferences.toggle);
	const preferences = useGlobalStore(useShallow(state => state.preferences));
	const initialized = useGlobalStore(state => state.session.initialized);
	const [submitted, setSubmitted] = useState(false);
	const { updatePreferences } = useSession();
	const { t } = useTranslation();
	const { country } = useCountry();
	const navigate = useNavigate();
	const { hide } = useUpdater();

	const form = useForm<AccountFormValues>({
		resolver: zodResolver(accountFormSchema),
		defaultValues: {
			country: i18n.defaultCountry,
			language: i18n.defaultLocale,
		},
	});

	useEffect(() => {
		const withUpdateAvailable = hide(shouldOpen);
		return () => {
			if (withUpdateAvailable) {
				hide(false);
			}
		};
	}, [shouldOpen, hide]);

	useEffect(() => {
		if (initialized) {
			if (preferences.country) {
				form.setValue("country", preferences.country.toLowerCase() as Country);
			}
			if (preferences.language) {
				form.setValue("language", preferences.language);
			}
		}
	}, [form, preferences, initialized]);

	const onSubmit = useCallback(
		(values: AccountFormValues) => {
			if (submitted) {
				return;
			}

			setSubmitted(true);
			updatePreferences({
				country: values.country.toUpperCase() as Country,
				language: values.language,
			})
				.then(() =>
					toast.success(t("preferences.toast"), {
						closeButton: true,
						dismissible: true,
					})
				)
				.catch(console.error)
				.finally(() => {
					setSubmitted(false);
					if (country !== values.country) {
						navigate(`/browse/${values.country}`, { flushSync: true });
					}
				});
		},
		[submitted, updatePreferences, t, country, navigate]
	);

	if (!initialized || !open) {
		return null;
	}

	return (
		<Dialog open={shouldOpen} onOpenChange={toggle}>
			<DialogContent className="max-w-md">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<DialogHeader>
							<DialogTitle>{t("preferences.preferences")}</DialogTitle>
							<DialogDescription>{t("preferences.description")}</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid gap-4 py-4">
								<FormField
									control={form.control}
									name="language"
									render={({ field }) => (
										<FormItem className="grid grid-cols-4 items-center gap-4">
											<FormLabel className="text-right">{t("preferences.language")}</FormLabel>

											<LanguagePopover
												current={field.value}
												onSelect={locale => {
													form.setValue("language", locale);
												}}
												contentClassName="w-[200px] h-[30vh]"
												className="w-[200px] justify-between"
											/>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="country"
									render={({ field }) => (
										<FormItem className="grid grid-cols-4 items-center gap-4">
											<FormLabel className="text-right">{t("preferences.country")}</FormLabel>

											<CountryPopover
												current={field.value}
												onSelect={country => {
													form.setValue("country", country);
												}}
												contentClassName="w-[200px] h-[30vh]"
												className="w-[200px] justify-between"
											/>

											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit">{t("preferences.update")}</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
