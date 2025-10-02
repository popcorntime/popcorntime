import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@popcorntime/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@popcorntime/ui/components/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "@popcorntime/ui/components/form";
import { Switch } from "@popcorntime/ui/components/switch";
import { appLogDir } from "@tauri-apps/api/path";
import { openPath } from "@tauri-apps/plugin-opener";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { useTauri } from "@/hooks/useTauri";
import { useUpdater } from "@/hooks/useUpdater";
import { useGlobalStore } from "@/stores/global";

const settingsFormSchema = z.object({
	enableAnalytics: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export function SettingsDialog() {
	const shouldOpen = useGlobalStore(state => state.dialogs.settings.isOpen);
	const toggleSettings = useGlobalStore(state => state.toggleSettings);
	const settings = useGlobalStore(state => state.settings);
	const [submitted, setSubmitted] = useState(false);
	const { api } = useTauri();
	const { t } = useTranslation();
	const { hide } = useUpdater();

	const openLogsDir = useCallback(async () => {
		const appLogDirPath = await appLogDir();
		openPath(appLogDirPath);
	}, []);

	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(settingsFormSchema),
		defaultValues: {
			enableAnalytics: settings.enableAnalytics ?? false,
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

	const onSubmit = useCallback(
		(values: SettingsFormValues) => {
			if (submitted) {
				return;
			}

			const { settingsSucceeded, settingsFailed } = useGlobalStore.getState();

			setSubmitted(true);
			settingsSucceeded(values);
			api
				.updateSettings(values)
				.then(() =>
					toast.success(t("settings.toast"), {
						closeButton: true,
						dismissible: true,
					})
				)
				.catch(settingsFailed)
				.finally(() => {
					setSubmitted(false);
					toggleSettings();
				});
		},
		[submitted, api.updateSettings, t, toggleSettings]
	);

	if (settings.status !== "ready" || !shouldOpen) {
		return null;
	}

	return (
		<Dialog open={shouldOpen} onOpenChange={toggleSettings}>
			<DialogContent className="max-w-md">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<DialogHeader>
							<DialogTitle>{t("settings.settings")}</DialogTitle>
							<DialogDescription>{t("settings.description")}</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<FormField
								control={form.control}
								name="enableAnalytics"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
										<div className="space-y-0.5">
											<FormLabel>{t("settings.analytics")}</FormLabel>
											<FormDescription>{t("settings.analytics-description")}</FormDescription>
										</div>
										<FormControl>
											<Switch checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
									</FormItem>
								)}
							/>

							<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
								<div className="space-y-0.5">
									<div>{t("settings.logs")}</div>
									<p className="text-muted-foreground text-sm">{t("settings.logs-description")}</p>
								</div>
								<div>
									<Button variant="accent" onClick={openLogsDir}>
										{t("settings.open-logs")}
									</Button>
								</div>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit">{t("settings.update")}</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
