import CRTEffect from "vault66-crt-effect";
import "@/css/crt.css";
import { buttonVariants } from "@popcorntime/ui/components/button";
import { cn } from "@popcorntime/ui/lib/utils";
import { MoveRightIcon, PlayCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useUpdater } from "@/hooks/useUpdater";

const DEFAULT_COUNTDOWN = 4;
interface KaraokeLineProps {
	text: string;
	start: number;
	end: number;
	getTime: () => number;
	className?: string;
}

function splitTokensPreserve(text: string) {
	const re = /([\p{L}\p{N}]+)|(\s+|[^\p{L}\p{N}\s]+)/gu;
	const out: { t: string; len: number; isWord: boolean }[] = [];
	let m: RegExpExecArray | null;
	m = re.exec(text);
	while (m) {
		const word = m[1];
		const other = m[2];
		if (word) {
			out.push({ t: word, len: word.length, isWord: true });
		} else if (other) {
			out.push({ t: other, len: other.length, isWord: false });
		}
		m = re.exec(text);
	}
	if (out.length === 0) {
		out.push({ t: text, len: text.length, isWord: true });
	}
	return out;
}

function KaraokeLine({ text, start, end, getTime, className }: KaraokeLineProps) {
	const tokens = useMemo(() => splitTokensPreserve(text), [text]);
	const [activeIdx, setActiveIdx] = useState<number>(-1);

	const spans = useMemo(() => {
		// distribute cue duration ~ proportional to token length (only for words)
		const totalWordChars = tokens.reduce((s, tk) => s + (tk.isWord ? tk.len : 0), 0) || 1;
		const dur = Math.max(0, end - start);
		let t = start;
		const res: { from: number; to: number }[] = [];
		for (const tk of tokens) {
			const frac = tk.isWord ? tk.len / totalWordChars : 0;
			const wDur = dur * frac;
			res.push({ from: t, to: t + wDur });
			t += wDur;
		}
		return res;
	}, [tokens, start, end]);

	useEffect(() => {
		let raf = 0;
		const tick = () => {
			const now = getTime();
			let idx = -1;
			for (let i = 0; i < spans.length; i++) {
				if (now >= (spans[i]?.from || 0) && now <= (spans[i]?.to || 0)) {
					idx = i;
					break;
				}
				if (now >= (spans[i]?.from || 0)) idx = i;
			}
			if (idx !== activeIdx) setActiveIdx(idx);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [spans, getTime, activeIdx]);

	return (
		<div className={cn("mx-auto w-full text-center font-bold leading-tight", className)}>
			<div className="inline-block min-h-[2lh] space-x-1 tracking-tighter">
				{tokens.map((tk, i) => {
					const isActive =
						i === activeIdx && tk.isWord && (spans[i]?.to || 0) > (spans[i]?.from || 0);
					return (
						<span
							key={`${tk.t.trim()}-${i}`}
							className={cn(
								"select-none cursor-default uppercase transition-[color,transform] duration-200",
								tk.isWord
									? cn(
											"inline-block align-baseline transform-gpu origin-center",
											isActive ? "text-foreground scale-110" : "text-muted-foreground/80 scale-100"
										)
									: "inline whitespace-pre text-muted-foreground/80"
							)}
						>
							{tk.t}
						</span>
					);
				})}
			</div>
		</div>
	);
}

interface AudioPlayerProps {
	audioUrl?: string;
	vttUrl?: string;
	onFinished?: () => void;
}
function AudioPlayer({ onFinished }: AudioPlayerProps) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const trackRef = useRef<HTMLTrackElement | null>(null);
	const [cueText, setCueText] = useState("");
	const [cueStart, setCueStart] = useState(0);
	const [cueEnd, setCueEnd] = useState(0);
	const finishedOnce = useRef(false);
	const [shouldInteract, setShouldInteract] = useState(false);
	const onFinishedRef = useRef(onFinished);
	const setShouldInteractRef = useRef(setShouldInteract);

	useEffect(() => {
		if (!audioRef.current) return;
		const audio = audioRef.current;
		const finish = () => {
			if (!finishedOnce.current) {
				finishedOnce.current = true;
				onFinishedRef.current?.();
			}
		};

		const wire = () => {
			const track = audio.textTracks?.[0];
			if (!track) return;
			track.mode = "hidden";
			const onCueChange = () => {
				const active = track.activeCues?.[0] as VTTCue | undefined;
				if (active) {
					setCueText(active.text);
					setCueStart(active.startTime);
					setCueEnd(active.endTime);
				} else {
					setCueStart(0);
					setCueEnd(0);
				}
			};
			track.addEventListener("cuechange", onCueChange);
			onCueChange();
			return () => track.removeEventListener("cuechange", onCueChange);
		};

		const cleanups: Array<() => void> = [];
		const u = wire();
		if (u) cleanups.push(u);

		const onLoadedMeta = () => {
			const u2 = wire();
			if (u2) cleanups.push(u2);
		};
		audio.addEventListener("loadedmetadata", onLoadedMeta);
		audio.addEventListener("ended", finish);
		audio.play().catch(e => {
			if (e?.name === "NotAllowedError") {
				setShouldInteractRef.current(true);
			}
		});

		return () => {
			cleanups.forEach(fn => {
				fn();
			});
			audio.removeEventListener("loadedmetadata", onLoadedMeta);
			audio.removeEventListener("ended", finish);
			audio.pause();
		};
	}, []);

	const cueSize = useMemo(() => {
		if (cueText.length < 20) return "text-6xl xl:text-7xl";
		if (cueText.length < 50) return "text-5xl xl:text-6xl";
		if (cueText.length < 100) return "text-4xl xl:text-5xl";
		return "text-3xl xl:text-4xl";
	}, [cueText]);

	const getTime = () => audioRef.current?.currentTime ?? 0;

	return (
		<div className="w-[50vw] text-center">
			<audio
				ref={audioRef}
				src="/audios/intro.m4a"
				crossOrigin="anonymous"
				preload="auto"
				aria-label="Popcorn Time Manifesto"
				className="hidden"
			>
				<track
					ref={trackRef}
					kind="captions"
					label="English"
					srcLang="en"
					src="/audios/intro.vtt"
					default
				/>
			</audio>

			{shouldInteract && (
				<button
					type="button"
					onClick={() => {
						audioRef.current?.play().catch(() => {
							// cant play, lets skip for now
							onFinished?.();
						});
						setShouldInteract(false);
					}}
				>
					<div className="flex items-center gap-4 text-5xl uppercase font-bold tracking-tighter text-muted-foreground/80">
						<PlayCircle className="size-15" />
						<span>Play</span>
					</div>
				</button>
			)}

			<KaraokeLine
				key={cueStart}
				text={cueText}
				start={cueStart}
				end={cueEnd}
				getTime={getTime}
				className={cn(cueSize, "tracking-wide")}
			/>
		</div>
	);
}

export function OnboardingManifest() {
	const navigate = useNavigate();
	const [isCompleted, setIsCompleted] = useState(false);
	const [countdown, setCountdown] = useState(DEFAULT_COUNTDOWN);
	const { hide } = useUpdater();
	const [params] = useSearchParams();

	// if linked from somewhere, go there next
	const nextUrl = useMemo(() => {
		return params.get("next") ?? "/onboarding/timeline";
	}, [params]);

	useEffect(() => {
		return () => {
			setIsCompleted(false);
			setCountdown(DEFAULT_COUNTDOWN);
		};
	}, []);

	useEffect(() => {
		if (!isCompleted) return;
		setCountdown(DEFAULT_COUNTDOWN);
		const interval = setInterval(() => {
			setCountdown(c => c - 1);
		}, 1000);
		return () => clearInterval(interval);
	}, [isCompleted]);

	useEffect(() => {
		if (isCompleted && countdown <= 0) {
			navigate(nextUrl);
		}
	}, [isCompleted, countdown, navigate, nextUrl]);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				navigate(nextUrl);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [navigate, nextUrl]);

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
				flickerIntensity="low"
			>
				<div className="flex min-h-svh w-screen flex-col items-center justify-center gap-12">
					<div className="flex flex-col items-center space-y-6 text-5xl">
						{!isCompleted && <AudioPlayer onFinished={() => setIsCompleted(true)} />}
						{isCompleted && (
							<Link to={nextUrl} className="text-muted-foreground font-bold hover:no-underline">
								<div className="flex items-center gap-2 [font-variant:small-caps]">
									<span>Continue</span>
									<MoveRightIcon className="size-12" />
								</div>
								<div className="text-muted-foregroun/75 mt-2 text-center text-sm font-normal">
									Redirecting in {countdown}s...
								</div>
							</Link>
						)}
					</div>
				</div>
			</CRTEffect>
			{!isCompleted && (
				<Link
					to={nextUrl}
					replace
					className={cn(
						buttonVariants({ variant: "link" }),
						"dark:text-muted-foreground/50 absolute top-0 right-0 z-[600] m-3 flex gap-2 hover:no-underline"
					)}
				>
					<kbd className="border-border bg-muted rounded-md border px-2 py-0.5 font-mono text-xs shadow-sm">
						Esc
					</kbd>
					<MoveRightIcon />
				</Link>
			)}
		</div>
	);
}
