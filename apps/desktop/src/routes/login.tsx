import { Button, buttonVariants } from "@popcorntime/ui/components/button";
import { open } from "@tauri-apps/plugin-shell";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import logo from "@/assets/logo.png";
import { useTauri } from "@/hooks/useTauri";
import { useGlobalStore } from "@/stores/global";

type Event = {
	authorizeUrl: string;
};

export function LoginRoute() {
	const { invoke, listen } = useTauri();
	const appInitialized = useGlobalStore(state => state.app.initialized);
	const navigate = useNavigate();

	async function initialize_session_authorization() {
		await invoke("initialize_session_authorization");
	}

	useEffect(() => {
		return listen<Event>("popcorntime://session_server_ready", event => {
			open(event.payload.authorizeUrl);
		});
	}, [listen]);

	useEffect(() => {
		if (!appInitialized) return;
		navigate("/");
	}, [appInitialized, navigate]);

	return (
		<main className="flex h-full">
			<div className="m-auto flex w-xs flex-col items-center justify-center gap-4">
				<img src={logo} alt="Popcorn Time" className="size-12 xl:size-14 dark:opacity-80" />

				<form
					className="flex flex-col gap-3"
					onSubmit={e => {
						e.preventDefault();
						initialize_session_authorization();
					}}
				>
					<Button size="xl" type="submit">
						Login
					</Button>
					<Link
						className={buttonVariants({ variant: "link", size: "xl" })}
						to="https://watch.popcorntime.app/signup"
						target="_blank"
					>
						No account? Signup
					</Link>
				</form>
			</div>
		</main>
	);
}
