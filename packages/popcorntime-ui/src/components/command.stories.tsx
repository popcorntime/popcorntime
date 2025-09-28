import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar, CreditCard, Film, Search, Settings, Smile, Star, Tv, User } from "lucide-react";
import { useState } from "react";
import { fn } from "storybook/test";
import { Button } from "@popcorntime/ui/components/button";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@popcorntime/ui/components/command";

const meta = {
	title: "Components/Command",
	component: Command,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Command palette component for fast navigation and action execution, built with cmdk.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		onValueChange: {
			action: "onValueChange",
			description: "Callback when selected value changes",
		},
	},
	args: {
		onValueChange: fn(),
	},
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="w-96">
			<Command className="rounded-lg border shadow-md">
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Suggestions">
						<CommandItem>
							<Calendar className="mr-2 h-4 w-4" />
							<span>Calendar</span>
						</CommandItem>
						<CommandItem>
							<Smile className="mr-2 h-4 w-4" />
							<span>Search Emoji</span>
						</CommandItem>
						<CommandItem>
							<CreditCard className="mr-2 h-4 w-4" />
							<span>Calculator</span>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Settings">
						<CommandItem>
							<User className="mr-2 h-4 w-4" />
							<span>Profile</span>
							<CommandShortcut>⌘P</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<CreditCard className="mr-2 h-4 w-4" />
							<span>Billing</span>
							<CommandShortcut>⌘B</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<Settings className="mr-2 h-4 w-4" />
							<span>Settings</span>
							<CommandShortcut>⌘S</CommandShortcut>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		</div>
	),
};

export const Dialog: Story = {
	render: () => {
		const [open, setOpen] = useState(false);

		return (
			<div className="space-y-4">
				<p className="text-sm text-muted-foreground">
					Press the button to open the command dialog or use ⌘K
				</p>
				<Button onClick={() => setOpen(true)} variant="outline">
					Open Command Palette
				</Button>

				<CommandDialog
					open={open}
					onOpenChange={setOpen}
					title="Command Center"
					description="Search for media, navigate, or execute commands"
				>
					<CommandInput placeholder="Search for movies, shows, or commands..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup heading="Media">
							<CommandItem>
								<Film className="mr-2 h-4 w-4" />
								<span>Browse Movies</span>
								<CommandShortcut>⌘M</CommandShortcut>
							</CommandItem>
							<CommandItem>
								<Tv className="mr-2 h-4 w-4" />
								<span>Browse TV Shows</span>
								<CommandShortcut>⌘T</CommandShortcut>
							</CommandItem>
							<CommandItem>
								<Star className="mr-2 h-4 w-4" />
								<span>My Favorites</span>
								<CommandShortcut>⌘F</CommandShortcut>
							</CommandItem>
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup heading="Navigation">
							<CommandItem>
								<Search className="mr-2 h-4 w-4" />
								<span>Global Search</span>
								<CommandShortcut>/</CommandShortcut>
							</CommandItem>
							<CommandItem>
								<Settings className="mr-2 h-4 w-4" />
								<span>Preferences</span>
								<CommandShortcut>⌘,</CommandShortcut>
							</CommandItem>
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup heading="Account">
							<CommandItem>
								<User className="mr-2 h-4 w-4" />
								<span>Profile</span>
							</CommandItem>
							<CommandItem>
								<CreditCard className="mr-2 h-4 w-4" />
								<span>Subscription</span>
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</CommandDialog>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Command dialog overlay for quick navigation and actions, similar to VS Code or Raycast",
			},
		},
	},
};

export const PopcornTimeCommands: Story = {
	render: () => (
		<div className="w-96">
			<Command className="rounded-lg border shadow-md">
				<CommandInput placeholder="Search movies, shows, or commands..." />
				<CommandList>
					<CommandEmpty>
						<div className="text-center py-6">
							<Search className="mx-auto h-8 w-8 text-muted-foreground/50" />
							<p className="mt-2 text-sm text-muted-foreground">No results found</p>
							<p className="text-xs text-muted-foreground">Try searching for a movie or TV show</p>
						</div>
					</CommandEmpty>

					<CommandGroup heading="Quick Actions">
						<CommandItem value="search-movies">
							<Film className="mr-2 h-4 w-4" />
							<span>Search Movies</span>
							<CommandShortcut>⌘M</CommandShortcut>
						</CommandItem>
						<CommandItem value="search-shows">
							<Tv className="mr-2 h-4 w-4" />
							<span>Search TV Shows</span>
							<CommandShortcut>⌘T</CommandShortcut>
						</CommandItem>
						<CommandItem value="favorites">
							<Star className="mr-2 h-4 w-4" />
							<span>View Favorites</span>
							<CommandShortcut>⌘F</CommandShortcut>
						</CommandItem>
					</CommandGroup>

					<CommandSeparator />

					<CommandGroup heading="Popular Movies">
						<CommandItem value="inception">
							<Film className="mr-2 h-4 w-4" />
							<div className="flex flex-col items-start">
								<span>Inception</span>
								<span className="text-xs text-muted-foreground">2010 • Sci-Fi, Thriller</span>
							</div>
						</CommandItem>
						<CommandItem value="interstellar">
							<Film className="mr-2 h-4 w-4" />
							<div className="flex flex-col items-start">
								<span>Interstellar</span>
								<span className="text-xs text-muted-foreground">2014 • Sci-Fi, Drama</span>
							</div>
						</CommandItem>
						<CommandItem value="the-dark-knight">
							<Film className="mr-2 h-4 w-4" />
							<div className="flex flex-col items-start">
								<span>The Dark Knight</span>
								<span className="text-xs text-muted-foreground">2008 • Action, Drama</span>
							</div>
						</CommandItem>
					</CommandGroup>

					<CommandSeparator />

					<CommandGroup heading="Settings">
						<CommandItem value="preferences">
							<Settings className="mr-2 h-4 w-4" />
							<span>Preferences</span>
							<CommandShortcut>⌘,</CommandShortcut>
						</CommandItem>
						<CommandItem value="account">
							<User className="mr-2 h-4 w-4" />
							<span>Account Settings</span>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Command palette styled for PopcornTime with media search and app-specific actions",
			},
		},
	},
};

export const WithCustomEmpty: Story = {
	render: () => (
		<div className="w-96">
			<Command className="rounded-lg border shadow-md">
				<CommandInput placeholder="Search..." defaultValue="xyz123notfound" />
				<CommandList>
					<CommandEmpty>
						<div className="flex flex-col items-center py-8 text-center">
							<Search className="h-12 w-12 text-muted-foreground/30" />
							<h3 className="mt-4 text-lg font-semibold">No results found</h3>
							<p className="mb-4 mt-2 text-sm text-muted-foreground max-w-xs">
								We couldn't find any movies, shows, or commands matching your search.
							</p>
							<Button variant="outline" size="sm">
								Clear Search
							</Button>
						</div>
					</CommandEmpty>
					<CommandGroup heading="Suggestions">
						<CommandItem>
							<Film className="mr-2 h-4 w-4" />
							<span>Browse Popular Movies</span>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Command component with custom empty state design",
			},
		},
	},
};

export const Loading: Story = {
	render: () => (
		<div className="w-96">
			<Command className="rounded-lg border shadow-md">
				<CommandInput placeholder="Searching..." />
				<CommandList>
					<CommandGroup heading="Results">
						<CommandItem disabled>
							<div className="flex items-center space-x-2 w-full">
								<div className="h-4 w-4 rounded bg-muted animate-pulse" />
								<div className="flex-1 space-y-1">
									<div className="h-4 bg-muted rounded animate-pulse" />
									<div className="h-3 bg-muted rounded animate-pulse w-3/4" />
								</div>
							</div>
						</CommandItem>
						<CommandItem disabled>
							<div className="flex items-center space-x-2 w-full">
								<div className="h-4 w-4 rounded bg-muted animate-pulse" />
								<div className="flex-1 space-y-1">
									<div className="h-4 bg-muted rounded animate-pulse" />
									<div className="h-3 bg-muted rounded animate-pulse w-2/3" />
								</div>
							</div>
						</CommandItem>
						<CommandItem disabled>
							<div className="flex items-center space-x-2 w-full">
								<div className="h-4 w-4 rounded bg-muted animate-pulse" />
								<div className="flex-1 space-y-1">
									<div className="h-4 bg-muted rounded animate-pulse" />
									<div className="h-3 bg-muted rounded animate-pulse w-1/2" />
								</div>
							</div>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Command component showing loading state with skeleton placeholders",
			},
		},
	},
};

export const Standalone: Story = {
	render: () => (
		<Command className="space-y-6 max-w-md">
			<div>
				<h3 className="font-medium mb-2">Command Input</h3>
				<CommandInput placeholder="Search anything..." />
			</div>

			<div>
				<h3 className="font-medium mb-2">Command Items</h3>
				<div className="rounded-lg border p-2">
					<CommandItem>
						<Film className="mr-2 h-4 w-4" />
						<span>Movies</span>
					</CommandItem>
					<CommandItem>
						<Tv className="mr-2 h-4 w-4" />
						<span>TV Shows</span>
						<CommandShortcut>⌘T</CommandShortcut>
					</CommandItem>
					<CommandItem disabled>
						<Settings className="mr-2 h-4 w-4" />
						<span>Settings (disabled)</span>
					</CommandItem>
				</div>
			</div>

			<div>
				<h3 className="font-medium mb-2">Command Separators</h3>
				<div className="rounded-lg border p-2">
					<CommandItem>Item 1</CommandItem>
					<CommandSeparator />
					<CommandItem>Item 2</CommandItem>
					<CommandSeparator />
					<CommandItem>Item 3</CommandItem>
				</div>
			</div>
		</Command>
	),
	parameters: {
		layout: "centered",
		docs: {
			description: {
				story: "Individual command components for testing and customization",
			},
		},
	},
};
