import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	Download,
	Edit,
	LogOut,
	MoreHorizontal,
	Settings,
	Share,
	Star,
	Trash2,
	User,
} from "lucide-react";
import { Button } from "@popcorntime/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@popcorntime/ui/components/dropdown-menu";

const meta = {
	title: "Components/DropdownMenu",
	component: DropdownMenu,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "A dropdown menu component with various actions and groups.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">Open Menu</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<User className="mr-2 h-4 w-4" />
					<span>Profile</span>
					<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Settings className="mr-2 h-4 w-4" />
					<span>Settings</span>
					<DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
					<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

export const MovieActions: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-48">
				<DropdownMenuLabel>Movie Actions</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<Download className="mr-2 h-4 w-4" />
					<span>Download</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Star className="mr-2 h-4 w-4" />
					<span>Add to Favorites</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Share className="mr-2 h-4 w-4" />
					<span>Share</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<Edit className="mr-2 h-4 w-4" />
						<span>Edit Info</span>
					</DropdownMenuItem>
					<DropdownMenuItem className="text-destructive">
						<Trash2 className="mr-2 h-4 w-4" />
						<span>Remove from Library</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	),
	parameters: {
		docs: {
			description: {
				story: "Dropdown menu for movie item actions in PopcornTime",
			},
		},
	},
};

export const UserProfile: Story = {
	render: () => (
		<div className="flex items-center gap-4 p-4 border rounded-lg">
			<div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
				JD
			</div>
			<div className="flex-1">
				<p className="font-medium">John Doe</p>
				<p className="text-sm text-muted-foreground">john@example.com</p>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-56">
					<DropdownMenuLabel>Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<User className="mr-2 h-4 w-4" />
							<span>View Profile</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Settings className="mr-2 h-4 w-4" />
							<span>Account Settings</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Sign Out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "User profile card with dropdown menu actions",
			},
		},
	},
};

export const QualitySelector: Story = {
	render: () => (
		<div className="p-4 border rounded-lg space-y-3">
			<h3 className="font-medium">Video Settings</h3>
			<div className="flex items-center justify-between">
				<span className="text-sm">Quality</span>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm">
							1080p Full HD
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Select Quality</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Auto</DropdownMenuItem>
						<DropdownMenuItem>720p HD</DropdownMenuItem>
						<DropdownMenuItem>1080p Full HD</DropdownMenuItem>
						<DropdownMenuItem>1440p QHD</DropdownMenuItem>
						<DropdownMenuItem>4K Ultra HD</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Quality selector dropdown in settings",
			},
		},
	},
};

export const LibraryFilter: Story = {
	render: () => (
		<div className="p-4 border rounded-lg space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="font-medium">My Library</h3>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm">
							Sort by Date
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuLabel>Sort Options</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Date Added (Newest)</DropdownMenuItem>
						<DropdownMenuItem>Date Added (Oldest)</DropdownMenuItem>
						<DropdownMenuItem>Alphabetical (A-Z)</DropdownMenuItem>
						<DropdownMenuItem>Alphabetical (Z-A)</DropdownMenuItem>
						<DropdownMenuItem>Rating (Highest)</DropdownMenuItem>
						<DropdownMenuItem>Rating (Lowest)</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Recently Watched</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="grid grid-cols-1 gap-2">
				{["Inception", "The Matrix", "Interstellar"].map(movie => (
					<div key={movie} className="flex items-center justify-between p-2 hover:bg-muted rounded">
						<span className="text-sm">{movie}</span>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="h-6 w-6">
									<MoreHorizontal className="h-3 w-3" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>
									<Download className="mr-2 h-4 w-4" />
									Watch
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Star className="mr-2 h-4 w-4" />
									Add to Favorites
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="text-destructive">
									<Trash2 className="mr-2 h-4 w-4" />
									Remove
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				))}
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Library view with sort dropdown and per-item action menus",
			},
		},
	},
};

export const NavigationMenu: Story = {
	render: () => (
		<div className="flex items-center justify-between p-4 border-b">
			<div className="flex items-center gap-2">
				<div className="h-6 w-6 bg-primary rounded-sm" />
				<span className="font-semibold">PopcornTime</span>
			</div>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost">Menu</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<User className="mr-2 h-4 w-4" />
							<span>Browse Movies</span>
							<DropdownMenuShortcut>⌘M</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Settings className="mr-2 h-4 w-4" />
							<span>Browse TV Shows</span>
							<DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<Star className="mr-2 h-4 w-4" />
							<span>Favorites</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Download className="mr-2 h-4 w-4" />
							<span>Downloads</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<Settings className="mr-2 h-4 w-4" />
						<span>Preferences</span>
						<DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Sign Out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				story: "Application navigation dropdown menu",
			},
		},
	},
};

export const ContextMenu: Story = {
	render: () => (
		<div className="space-y-4">
			<p className="text-sm text-muted-foreground mb-4">
				Right-click on the movie cards below to see context menus
			</p>
			<div className="grid grid-cols-2 gap-4">
				{["The Batman", "Dune", "Spider-Man: No Way Home", "Top Gun: Maverick"].map(movie => (
					<DropdownMenu key={movie}>
						<DropdownMenuTrigger asChild>
							<div className="p-4 border rounded-lg hover:bg-muted cursor-pointer">
								<div className="aspect-[2/3] bg-muted rounded mb-2" />
								<h4 className="font-medium text-sm">{movie}</h4>
								<p className="text-xs text-muted-foreground">2022 • Action</p>
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>
								<Download className="mr-2 h-4 w-4" />
								<span>Watch Now</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Star className="mr-2 h-4 w-4" />
								<span>Add to Favorites</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Share className="mr-2 h-4 w-4" />
								<span>Share</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<Edit className="mr-2 h-4 w-4" />
								<span>Movie Details</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				))}
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Context menus on movie cards for quick actions",
			},
		},
	},
};
