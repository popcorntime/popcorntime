import { Button, buttonVariants } from "@popcorntime/ui/components/button";
import { ScrollArea } from "@popcorntime/ui/components/scroll-area";
import { TimelineLayout } from "@popcorntime/ui/components/timeline-layout";
import { cn } from "@popcorntime/ui/lib/utils";
import { Check, FileVideoIcon, MoveRightIcon, TabletSmartphone, TvMinimalPlay } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTauri } from "@/hooks/useTauri";
import { useUpdater } from "@/hooks/useUpdater";
import { useGlobalStore } from "@/stores/global";

function GithubIcon({ className }: { className?: string }) {
	return (
		<svg role="img" viewBox="0 0 24 24" className={cn("size-4", className)}>
			<title>Github</title>
			<path
				fill="currentColor"
				d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
			/>
		</svg>
	);
}

export function OnboardingTimeline() {
	const navigate = useNavigate();
	const { hide } = useUpdater();
	const { invoke } = useTauri();
	const [isWorking, setIsWorking] = useState(false);
	const setOnboarded = useGlobalStore(state => state.settings.setOnboarded);

	useEffect(() => {
		hide(true);
		return () => {
			hide(false);
		};
	}, [hide]);

	const startBrowsing = useCallback(() => {
		setIsWorking(true);
		invoke("set_onboarded", undefined).then(() => {
			setIsWorking(false);
			setOnboarded(true);
			navigate("/");
		});
	}, [invoke, navigate, setOnboarded]);

	return (
		<div className="flex min-h-svh w-full flex-col justify-center gap-12">
			<ScrollArea className="text-muted-foreground h-full w-full cursor-default overflow-hidden text-lg leading-7 font-bold select-none">
				<div className="mx-auto mt-15 h-[55vh] w-[70vw]">
					<h1 className="scroll-m-20 text-left text-4xl font-extrabold tracking-tight text-balance">
						What to expect.
					</h1>
					<p className="leading-7 [&:not(:first-child)]:mt-6">
						Today marks the release of our first version, laying the foundation for a new adventure.
					</p>
					<TimelineLayout
						animate
						className={cn("text-muted-foreground flex w-full items-start")}
						iconColor="primary"
						items={[
							{
								color: "muted",
								date: "Planned",
								description:
									"Bringing Popcorn Time to your pocket with native apps for iOS and Android.",
								icon: <TabletSmartphone />,
								id: 1,
								status: "pending",
								title: "Mobile Applications",
							},
							{
								color: "muted",
								date: "Planned",
								description:
									"Expanding to your living room with native apps for major smart TV platforms.",
								icon: <TvMinimalPlay />,
								id: 2,
								status: "pending",
								title: "Smart TV Applications",
							},
							{
								color: "muted",
								date: "In Progress",
								description:
									"Next up: play your own files, cast to devices, and enjoy offline viewing, built right into Popcorn Time.",
								icon: <FileVideoIcon />,
								id: 3,
								status: "in-progress",
								title: "Local Backend",
							},
							{
								date: "Completed",
								description:
									"Built the Popcorn Time scraper and index streaming links, backed by a solid database and API foundation that will be open-sourced soon.",
								icon: <Check />,
								id: 4,
								color: "primary",
								status: "completed",
								title: "Core Data & API",
							},
							{
								date: "Completed",
								description:
									"First public desktop release: stable core, secure updater, solid foundation.",
								icon: <Check />,
								id: 5,
								color: "primary",
								status: "completed",
								title: "Alpha Desktop",
							},
						]}
						size="lg"
					/>
				</div>
			</ScrollArea>
			<div className="mx-auto flex w-[70vw] flex-col gap-4">
				<Link
					to="https://github.com/popcorntime"
					target="_blank"
					className={cn(buttonVariants({ variant: "outline" }), "flex w-full items-center gap-2")}
				>
					<span>Follow us on Github</span>
					<GithubIcon className="text-primary" />
				</Link>
				<Button
					disabled={isWorking}
					onClick={startBrowsing}
					className="flex w-full items-center gap-2"
				>
					<span>{isWorking ? "Please wait..." : "Finish"}</span>
					<MoveRightIcon />
				</Button>
			</div>
		</div>
	);
}
