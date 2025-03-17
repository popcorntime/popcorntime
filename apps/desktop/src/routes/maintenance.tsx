import { buttonVariants } from "@popcorntime/ui/components/button";
import { cn } from "@popcorntime/ui/lib/utils";
import { Link } from "react-router";

export function MaintenanceRoute() {
	return (
		<main className="relative isolate flex h-full flex-col items-center justify-center py-20 text-center sm:py-32">
			<p className="text-sm font-semibold text-gray-300">503</p>
			<h1 className="mt-2 text-3xl font-medium tracking-tight text-gray-300">
				Service unavailable
			</h1>
			<p className="mt-2 text-lg text-gray-600">
				The server is currently unavailable (because it is overloaded or down for maintenance).
			</p>
			<Link to="/" className={cn("mt-6", buttonVariants({ variant: "secondary" }))}>
				Refresh
			</Link>
		</main>
	);
}
