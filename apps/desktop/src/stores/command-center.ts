import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "@/stores/devtools";

export type CommandId = "main" | "movies" | "tv-shows" | "change-region" | "populars";
export type View = "main" | "search-result" | "country-selection";

export interface CommandGroup {
	label: string;
	commands: Command[];
}

export interface Command {
	id: CommandId;
	label: string;
	keywords: string[];
	view?: View;
}

export interface CommandCenterState {
	isOpen: boolean;
	toggle: () => void;
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
	query?: string;
	setQuery: (query?: string) => void;
	view: View;
	goto: (view: View) => void;
	reset: () => void;
}

export const defaultCommands: CommandGroup[] = [
	{
		label: "Navigation",
		commands: [
			{
				id: "main",
				label: "Home",
				keywords: ["home", "start"],
				view: "main",
			},
			{
				id: "populars",
				label: "Populars",
				keywords: ["populars", "trending"],
			},
			{
				id: "movies",
				label: "Movies",
				keywords: ["movies", "films"],
			},
			{
				id: "tv-shows",
				label: "TV Shows",
				keywords: ["tv", "shows", "series", "episodes"],
			},
		],
	},
	{
		label: "Change Region",
		commands: [
			{
				id: "change-region",
				label: "Change Region",
				keywords: ["region", "country", "location"],
				view: "country-selection",
			},
		],
	},
];

export const useCommandCenterStore = create<CommandCenterState>()(
	devtools(
		immer(set => ({
			isOpen: false,
			toggle: () =>
				set(state => {
					state.isOpen = !state.isOpen;
				}),
			isLoading: false,
			setIsLoading: loading =>
				set(state => {
					state.isLoading = loading;
				}),
			query: undefined,
			setQuery: query =>
				set(state => {
					state.query = query;
				}),
			view: "main",
			goto: view =>
				set(state => {
					state.view = view;
				}),
			reset: () =>
				set(state => {
					state.isOpen = false;
					state.query = undefined;
					state.isLoading = false;
					state.view = "main";
				}),
		})),
		{
			name: "Command Center",
			port: 8000,
			realtime: true,
		}
	)
);

export const resetCommandCenterStore = () => {
	const initial = useCommandCenterStore.getInitialState();
	useCommandCenterStore.setState(initial, true);
};
