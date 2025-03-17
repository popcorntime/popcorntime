import { SidebarInset } from "@popcorntime/ui/components/sidebar";
import { Outlet } from "react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { MediaDialog } from "@/components/modal/media";
import { PreferencesDialog } from "@/components/modal/preferences";
import { WatchPreferencesDialog } from "@/components/modal/watch-preferences";
import { CountryProvider } from "@/hooks/useCountry";

export function DefaultLayout() {
	return (
		<>
			<div className="absolute top-0 left-0 isolate z-40 h-14 w-full" data-tauri-drag-region></div>
			<Outlet />
			<PreferencesDialog />
		</>
	);
}

export function BrowseLayout() {
	return (
		<CountryProvider>
			<div className="isolate flex w-full flex-col overscroll-none">
				<Header />

				<div className="group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex h-full w-full">
					<AppSidebar variant="sidebar" />
					<SidebarInset className="pt-14">
						<div className="flex flex-1 flex-col gap-4">
							<Outlet />
						</div>
					</SidebarInset>
				</div>
			</div>

			<PreferencesDialog />
			<WatchPreferencesDialog />
			<MediaDialog />
		</CountryProvider>
	);
}
