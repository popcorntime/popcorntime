import { SidebarProvider } from "@popcorntime/ui/components/sidebar";
import { Toaster } from "@popcorntime/ui/components/sonner";
import { TooltipProvider } from "@popcorntime/ui/components/tooltip";
import { CheckCircle } from "lucide-react";
import { SessionProvider } from "@/hooks/useSession";
import { UpdaterProvider } from "@/hooks/useUpdater";
import { SettingsProvider } from "./hooks/useSettings";

export function Providers({ children }: React.PropsWithChildren) {
	return (
		<SettingsProvider>
			<SessionProvider>
				<UpdaterProvider>
					<TooltipProvider>
						<SidebarProvider className="h-full" defaultOpen={false}>
							{children}
							<Toaster
								duration={2000}
								expand={false}
								icons={{
									success: <CheckCircle className="ml-4 size-4" />,
								}}
								className="-z-10"
							/>
						</SidebarProvider>
					</TooltipProvider>
				</UpdaterProvider>
			</SessionProvider>
		</SettingsProvider>
	);
}
