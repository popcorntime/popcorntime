import Typewriter from "typewriter-effect";
import logo from "@/assets/logo_grayscale.png";

const bootingWords = [
	"Démarrage...",
	"Iniciando...",
	"Startvorgang...",
	"Avvio...",
	"Inicializando...",
	"Загрузка",
	"جارٍ التشغيل",
];

function shuffle<T>(array: T[]): T[] {
	const a: T[] = [...array];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const tmp = a[i];
		if (tmp && a[j]) {
			a[i] = a[j];
			a[j] = tmp;
		}
	}
	return a;
}
export function SplashScreen() {
	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center gap-6">
			<img src={logo} alt="Popcorn Time" className="size-18 dark:opacity-80" />
			<div className="text-muted-foreground text-4xl font-semibold">
				<Typewriter
					onInit={typewriter => {
						// no translation, to prevent flickering
						typewriter = typewriter.changeDelay(0.01);
						shuffle(bootingWords).forEach(word => {
							typewriter = typewriter.changeDelay(0.01).typeString(word).pauseFor(500).deleteAll();
						});
						typewriter.start();
					}}
				/>
			</div>
		</div>
	);
}
