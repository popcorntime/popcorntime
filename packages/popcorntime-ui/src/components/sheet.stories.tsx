import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Download, Settings, Shield, Star, User } from "lucide-react";
import { fn } from "storybook/test";
import { Button } from "@popcorntime/ui/components/button";
import { Input } from "@popcorntime/ui/components/input";
import { Label } from "@popcorntime/ui/components/label";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@popcorntime/ui/components/sheet";

const meta = {
	title: "Components/Sheet",
	component: Sheet,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A sheet dialog that slides in from the edge of the screen, commonly used for navigation menus or forms.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		open: {
			control: "boolean",
			description: "Whether the sheet is open",
		},
		onOpenChange: {
			action: "onOpenChange",
			description: "Callback when sheet open state changes",
		},
	},
	args: {
		onOpenChange: fn(),
	},
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline">Open Sheet</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Sheet Title</SheetTitle>
					<SheetDescription>
						This is a sheet dialog. It slides in from the side of the screen.
					</SheetDescription>
				</SheetHeader>
				<div className="py-4">
					<p className="text-sm text-muted-foreground">
						Sheet content goes here. You can include forms, navigation, or any other content.
					</p>
				</div>
				<SheetFooter>
					<SheetClose asChild>
						<Button variant="outline">Cancel</Button>
					</SheetClose>
					<Button>Save Changes</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	),
};

export const LeftSide: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline">Open Left Sheet</Button>
			</SheetTrigger>
			<SheetContent side="left">
				<SheetHeader>
					<SheetTitle>Navigation Menu</SheetTitle>
					<SheetDescription>Navigate to different sections of the application.</SheetDescription>
				</SheetHeader>
				<div className="py-6">
					<nav className="space-y-2">
						<a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
							<User className="h-4 w-4" />
							Profile
						</a>
						<a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
							<Settings className="h-4 w-4" />
							Settings
						</a>
						<a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
							<Bell className="h-4 w-4" />
							Notifications
						</a>
						<a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
							<Shield className="h-4 w-4" />
							Privacy
						</a>
					</nav>
				</div>
			</SheetContent>
		</Sheet>
	),
	parameters: {
		docs: {
			description: {
				story: "Sheet sliding in from the left side, commonly used for navigation",
			},
		},
	},
};

export const TopSide: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline">Open Top Sheet</Button>
			</SheetTrigger>
			<SheetContent side="top">
				<SheetHeader>
					<SheetTitle>Notification Center</SheetTitle>
					<SheetDescription>Recent updates and notifications from PopcornTime.</SheetDescription>
				</SheetHeader>
				<div className="py-4">
					<div className="space-y-3">
						<div className="flex items-start gap-3 p-3 border rounded-lg">
							<div className="h-2 w-2 bg-blue-500 rounded-full mt-2" />
							<div>
								<p className="text-sm font-medium">New movie added</p>
								<p className="text-xs text-muted-foreground">"The Batman" is now available</p>
							</div>
						</div>
						<div className="flex items-start gap-3 p-3 border rounded-lg">
							<div className="h-2 w-2 bg-green-500 rounded-full mt-2" />
							<div>
								<p className="text-sm font-medium">Download complete</p>
								<p className="text-xs text-muted-foreground">"Stranger Things S4" ready to watch</p>
							</div>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	),
	parameters: {
		docs: {
			description: {
				story: "Sheet sliding down from the top, useful for notifications or quick actions",
			},
		},
	},
};

export const BottomSide: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline">Open Bottom Sheet</Button>
			</SheetTrigger>
			<SheetContent side="bottom">
				<SheetHeader>
					<SheetTitle>Quick Actions</SheetTitle>
					<SheetDescription>Common actions you can perform quickly.</SheetDescription>
				</SheetHeader>
				<div className="py-6">
					<div className="grid grid-cols-2 gap-4">
						<Button variant="outline" className="gap-2">
							<Download className="h-4 w-4" />
							Download
						</Button>
						<Button variant="outline" className="gap-2">
							<Star className="h-4 w-4" />
							Favorite
						</Button>
						<Button variant="outline" className="gap-2">
							<Settings className="h-4 w-4" />
							Settings
						</Button>
						<Button variant="outline" className="gap-2">
							<User className="h-4 w-4" />
							Profile
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	),
	parameters: {
		docs: {
			description: {
				story: "Sheet sliding up from the bottom, great for mobile-style action sheets",
			},
		},
	},
};

export const EditProfile: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger asChild>
				<Button>Edit Profile</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Edit Profile</SheetTitle>
					<SheetDescription>
						Make changes to your profile here. Click save when you're done.
					</SheetDescription>
				</SheetHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input id="name" defaultValue="Pedro Duarte" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="username">Username</Label>
						<Input id="username" defaultValue="@peduarte" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" defaultValue="pedro@example.com" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="bio">Bio</Label>
						<textarea
							id="bio"
							className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							placeholder="Tell us a little bit about yourself"
							defaultValue="I love watching movies and TV shows on PopcornTime!"
						/>
					</div>
				</div>
				<SheetFooter>
					<SheetClose asChild>
						<Button variant="outline">Cancel</Button>
					</SheetClose>
					<Button type="submit">Save changes</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	),
	parameters: {
		docs: {
			description: {
				story: "Sheet containing a form for editing user profile",
			},
		},
	},
};

export const MovieDetails: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline">Movie Details</Button>
			</SheetTrigger>
			<SheetContent className="w-[400px] sm:w-[540px]">
				<SheetHeader>
					<SheetTitle>Inception (2010)</SheetTitle>
					<SheetDescription>Sci-Fi, Thriller • 148 min • PG-13</SheetDescription>
				</SheetHeader>

				<div className="py-6 space-y-6">
					{/* Movie poster placeholder */}
					<div className="aspect-[2/3] w-48 bg-muted rounded-lg mx-auto" />

					<div>
						<h3 className="font-semibold mb-2">Synopsis</h3>
						<p className="text-sm text-muted-foreground">
							A thief who steals corporate secrets through the use of dream-sharing technology is
							given the inverse task of planting an idea into the mind of a C.E.O.
						</p>
					</div>

					<div>
						<h3 className="font-semibold mb-2">Cast</h3>
						<p className="text-sm text-muted-foreground">
							Leonardo DiCaprio, Marion Cotillard, Tom Hardy, Ellen Page, Ken Watanabe
						</p>
					</div>

					<div>
						<h3 className="font-semibold mb-2">Rating</h3>
						<div className="flex items-center gap-2">
							<div className="flex">
								{Array.from({ length: 5 }).map((_, i) => (
									<Star
										key={i}
										className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
									/>
								))}
							</div>
							<span className="text-sm text-muted-foreground">8.8/10</span>
						</div>
					</div>
				</div>

				<SheetFooter>
					<Button variant="outline" className="gap-2">
						<Star className="h-4 w-4" />
						Add to Favorites
					</Button>
					<Button className="gap-2">
						<Download className="h-4 w-4" />
						Watch Now
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	),
	parameters: {
		docs: {
			description: {
				story: "Sheet displaying detailed movie information with actions",
			},
		},
	},
};

export const SettingsSheet: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" className="gap-2">
					<Settings className="h-4 w-4" />
					Settings
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Settings</SheetTitle>
					<SheetDescription>Configure your PopcornTime preferences.</SheetDescription>
				</SheetHeader>

				<div className="py-6 space-y-6">
					<div className="space-y-3">
						<h3 className="font-semibold">Video Quality</h3>
						<div className="space-y-2">
							<Label className="text-sm">Default streaming quality</Label>
							<select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
								<option>Auto</option>
								<option>720p HD</option>
								<option selected>1080p Full HD</option>
								<option>4K Ultra HD</option>
							</select>
						</div>
					</div>

					<div className="space-y-3">
						<h3 className="font-semibold">Downloads</h3>
						<div className="space-y-2">
							<Label className="text-sm">Download location</Label>
							<div className="flex gap-2">
								<Input defaultValue="/Users/username/Downloads/PopcornTime" />
								<Button variant="outline" size="sm">
									Browse
								</Button>
							</div>
						</div>
					</div>

					<div className="space-y-3">
						<h3 className="font-semibold">Privacy</h3>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label className="text-sm">Use VPN when streaming</Label>
								<input type="checkbox" className="h-4 w-4" />
							</div>
							<div className="flex items-center justify-between">
								<Label className="text-sm">Anonymous usage statistics</Label>
								<input type="checkbox" className="h-4 w-4" defaultChecked />
							</div>
						</div>
					</div>
				</div>

				<SheetFooter>
					<SheetClose asChild>
						<Button variant="outline">Cancel</Button>
					</SheetClose>
					<Button>Save Settings</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	),
	parameters: {
		docs: {
			description: {
				story: "Settings sheet with various configuration options",
			},
		},
	},
};

export const CompactSheet: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="sm">
					Quick Actions
				</Button>
			</SheetTrigger>
			<SheetContent className="w-[300px]">
				<SheetHeader>
					<SheetTitle>Quick Actions</SheetTitle>
				</SheetHeader>
				<div className="py-4">
					<div className="grid gap-2">
						<Button variant="ghost" className="justify-start gap-2">
							<Download className="h-4 w-4" />
							Download Movie
						</Button>
						<Button variant="ghost" className="justify-start gap-2">
							<Star className="h-4 w-4" />
							Add to Favorites
						</Button>
						<Button variant="ghost" className="justify-start gap-2">
							<Bell className="h-4 w-4" />
							Set Reminder
						</Button>
						<Button variant="ghost" className="justify-start gap-2">
							<Settings className="h-4 w-4" />
							Preferences
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	),
	parameters: {
		docs: {
			description: {
				story: "Compact sheet with quick action buttons",
			},
		},
	},
};
