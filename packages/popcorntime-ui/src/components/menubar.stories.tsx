import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download, Edit, File, Film, LogOut, Settings, Star, Tv, User } from "lucide-react";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	MenubarTrigger,
} from "@popcorntime/ui/components/menubar";

const meta = {
	title: "Components/Menubar",
	component: Menubar,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "A horizontally oriented menu bar with multiple dropdown menus.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>File</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						New Tab
						<MenubarShortcut>⌘T</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						New Window
						<MenubarShortcut>⌘N</MenubarShortcut>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>Share</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>Print</MenubarItem>
				</MenubarContent>
			</MenubarMenu>

			<MenubarMenu>
				<MenubarTrigger>Edit</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						Undo
						<MenubarShortcut>⌘Z</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Redo
						<MenubarShortcut>⇧⌘Z</MenubarShortcut>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						Find
						<MenubarShortcut>⌘F</MenubarShortcut>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>

			<MenubarMenu>
				<MenubarTrigger>View</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Always Show Bookmarks Bar</MenubarItem>
					<MenubarItem>Always Show Full URLs</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>Reload</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};

export const PopcornTimeHeader: Story = {
	render: () => (
		<div className="w-full border-b">
			<div className="flex items-center justify-between p-2">
				<div className="flex items-center gap-2">
					<div className="h-6 w-6 bg-primary rounded-sm flex items-center justify-center">
						<Film className="h-4 w-4 text-primary-foreground" />
					</div>
					<span className="font-semibold text-sm">PopcornTime</span>
				</div>

				<Menubar className="border-none">
					<MenubarMenu>
						<MenubarTrigger className="px-3 py-1.5">Media</MenubarTrigger>
						<MenubarContent>
							<MenubarItem>
								<Film className="mr-2 h-4 w-4" />
								Browse Movies
								<MenubarShortcut>⌘M</MenubarShortcut>
							</MenubarItem>
							<MenubarItem>
								<Tv className="mr-2 h-4 w-4" />
								Browse TV Shows
								<MenubarShortcut>⌘T</MenubarShortcut>
							</MenubarItem>
							<MenubarSeparator />
							<MenubarItem>
								<Star className="mr-2 h-4 w-4" />
								Favorites
								<MenubarShortcut>⌘F</MenubarShortcut>
							</MenubarItem>
							<MenubarItem>
								<Download className="mr-2 h-4 w-4" />
								Downloads
							</MenubarItem>
						</MenubarContent>
					</MenubarMenu>

					<MenubarMenu>
						<MenubarTrigger className="px-3 py-1.5">Tools</MenubarTrigger>
						<MenubarContent>
							<MenubarItem>
								Search
								<MenubarShortcut>/</MenubarShortcut>
							</MenubarItem>
							<MenubarItem>
								Command Palette
								<MenubarShortcut>⌘K</MenubarShortcut>
							</MenubarItem>
							<MenubarSeparator />
							<MenubarItem>Clear Cache</MenubarItem>
							<MenubarItem>Reset Settings</MenubarItem>
						</MenubarContent>
					</MenubarMenu>

					<MenubarMenu>
						<MenubarTrigger className="px-3 py-1.5">Account</MenubarTrigger>
						<MenubarContent>
							<MenubarItem>
								<User className="mr-2 h-4 w-4" />
								Profile
							</MenubarItem>
							<MenubarItem>
								<Settings className="mr-2 h-4 w-4" />
								Preferences
								<MenubarShortcut>⌘,</MenubarShortcut>
							</MenubarItem>
							<MenubarSeparator />
							<MenubarItem>
								<LogOut className="mr-2 h-4 w-4" />
								Sign Out
							</MenubarItem>
						</MenubarContent>
					</MenubarMenu>
				</Menubar>
			</div>
		</div>
	),
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				story: "PopcornTime application header with menubar navigation",
			},
		},
	},
};

export const WithIcons: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>
					<File className="mr-2 h-4 w-4" />
					File
				</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						<File className="mr-2 h-4 w-4" />
						New File
						<MenubarShortcut>⌘N</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						<Settings className="mr-2 h-4 w-4" />
						Open
						<MenubarShortcut>⌘O</MenubarShortcut>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						<Download className="mr-2 h-4 w-4" />
						Save
						<MenubarShortcut>⌘S</MenubarShortcut>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>

			<MenubarMenu>
				<MenubarTrigger>
					<Edit className="mr-2 h-4 w-4" />
					Edit
				</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Undo</MenubarItem>
					<MenubarItem>Redo</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>Cut</MenubarItem>
					<MenubarItem>Copy</MenubarItem>
					<MenubarItem>Paste</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
	parameters: {
		docs: {
			description: {
				story: "Menubar with icons in triggers and menu items",
			},
		},
	},
};

export const SingleMenu: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>Options</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Settings</MenubarItem>
					<MenubarItem>Help</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>About</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
	parameters: {
		docs: {
			description: {
				story: "Menubar with a single menu",
			},
		},
	},
};

export const LongMenus: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>Media Types</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Action Movies</MenubarItem>
					<MenubarItem>Adventure Movies</MenubarItem>
					<MenubarItem>Comedy Movies</MenubarItem>
					<MenubarItem>Drama Movies</MenubarItem>
					<MenubarItem>Horror Movies</MenubarItem>
					<MenubarItem>Romance Movies</MenubarItem>
					<MenubarItem>Sci-Fi Movies</MenubarItem>
					<MenubarItem>Thriller Movies</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>TV Shows</MenubarItem>
					<MenubarItem>Documentaries</MenubarItem>
					<MenubarItem>Anime</MenubarItem>
				</MenubarContent>
			</MenubarMenu>

			<MenubarMenu>
				<MenubarTrigger>Quality</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>720p HD</MenubarItem>
					<MenubarItem>1080p Full HD</MenubarItem>
					<MenubarItem>1440p QHD</MenubarItem>
					<MenubarItem>2160p 4K UHD</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
	parameters: {
		docs: {
			description: {
				story: "Menubar with longer menus showing media categories",
			},
		},
	},
};

export const DisabledItems: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>Actions</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Available Action</MenubarItem>
					<MenubarItem disabled>Disabled Action</MenubarItem>
					<MenubarItem>Another Available Action</MenubarItem>
					<MenubarSeparator />
					<MenubarItem disabled>
						Premium Feature
						<MenubarShortcut>Pro</MenubarShortcut>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
	parameters: {
		docs: {
			description: {
				story: "Menubar with disabled menu items",
			},
		},
	},
};

export const CustomShortcuts: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>Navigation</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						Go Back
						<MenubarShortcut>⌘←</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Go Forward
						<MenubarShortcut>⌘→</MenubarShortcut>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						Home
						<MenubarShortcut>⌘H</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Search
						<MenubarShortcut>⌘/</MenubarShortcut>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>

			<MenubarMenu>
				<MenubarTrigger>Playback</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						Play/Pause
						<MenubarShortcut>Space</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Skip Forward
						<MenubarShortcut>→</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Skip Backward
						<MenubarShortcut>←</MenubarShortcut>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						Full Screen
						<MenubarShortcut>F</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Mute
						<MenubarShortcut>M</MenubarShortcut>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
	parameters: {
		docs: {
			description: {
				story: "Menubar with custom keyboard shortcuts for PopcornTime actions",
			},
		},
	},
};
