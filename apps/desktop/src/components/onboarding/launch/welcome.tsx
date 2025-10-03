import Typewriter from "typewriter-effect";
import CRTEffect from "vault66-crt-effect";
import logo from "@/assets/logo_grayscale.png";
import "@/css/crt.css";
import { buttonVariants } from "@popcorntime/ui/components/button";
import { cn } from "@popcorntime/ui/lib/utils";
import { MoveRightIcon, Volume2 } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useUpdater } from "@/hooks/useUpdater";

export function OnboardingWelcome() {
	const navigate = useNavigate();
	const { hide } = useUpdater();
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				navigate("/onboarding/manifest", {
					replace: true,
				});
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [navigate]);

	useEffect(() => {
		hide(true);
		return () => {
			hide(false);
		};
	}, [hide]);

	return (
		<div>
			<CRTEffect
				enabled={true}
				enableSweep={true}
				sweepThickness={0.1}
				sweepDuration={0.5}
				enableFlicker={true}
				glitchMode={true}
				enableVignette={true}
				glitchIntensity="low"
				flickerIntensity="high"
			>
				<div className="flex min-h-svh w-screen flex-col items-center justify-center gap-12">
					<div className="flex flex-col items-center space-y-6">
						<img src={logo} alt="Popcorn Time" className="z-[800] size-18 dark:opacity-80" />
						<div className="text-muted-foreground z-[800] text-4xl font-semibold">
							<Typewriter
								onInit={typewriter => {
									typewriter
										.typeString("Hello, World.")
										.pauseFor(1500)
										.deleteAll()
										.typeString("We're back.")
										.pauseFor(1500)
										.callFunction(() => {
											navigate("/onboarding/manifest", {
												replace: true,
											});
										})
										.start();
								}}
							/>
						</div>
					</div>
				</div>
			</CRTEffect>
			<Link
				to="/onboarding/manifest"
				replace
				className={cn(
					buttonVariants({ variant: "link" }),
					"dark:text-muted-foreground/50 absolute top-0 right-0 z-[600] m-3 flex gap-2"
				)}
			>
				<kbd className="border-border bg-muted rounded-md border px-2 hover:no-underline py-0.5 font-mono text-xs shadow-sm">
					Esc
				</kbd>
				<MoveRightIcon />
			</Link>

			<div
				aria-live="polite"
				className="pointer-events-auto fixed bottom-12 left-1/2 -translate-x-1/2"
			>
				<div className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1.5 text-sm text-foreground shadow backdrop-blur-md border-border">
					<Volume2 className="h-4 w-4 animate-pulse" aria-hidden="true" />
					<span className="font-medium">Turn your sound on</span>
				</div>
			</div>
		</div>
	);
}
