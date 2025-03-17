import { buttonVariants } from "@popcorntime/ui/components/button";
import { cn } from "@popcorntime/ui/lib/utils";
import { Link } from "react-router";

export function NotFoundRoute() {
	return (
		<main className="relative isolate flex h-full flex-col items-center justify-center py-20 text-center sm:py-32">
			<p className="text-sm font-semibold text-gray-300">404</p>
			<h1 className="mt-2 text-3xl font-medium tracking-tight text-gray-300">Page not found</h1>
			<p className="mt-2 text-lg text-gray-600">
				Sorry, we couldn&apos;t find the page you&apos;re looking for.
			</p>
			<Link to="/" className={cn("mt-6", buttonVariants({ variant: "secondary" }))}>
				Go back home
			</Link>
		</main>
	);
}
