import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@popcorntime/ui/components/alert-dialog";
import { Button } from "@popcorntime/ui/components/button.js";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const meta = {
	title: "Components/AlertDialog",
	component: AlertDialog,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A modal dialog that interrupts the user with important content and expects a response.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		open: {
			control: "boolean",
			description: "Whether the alert dialog is open",
		},
		onOpenChange: {
			action: "onOpenChange",
			description: "Callback when dialog open state changes",
		},
	},
	args: {
		onOpenChange: fn(),
	},
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline">Show Dialog</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your account and remove your
						data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};

export const Destructive: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive">Delete Account</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Account</AlertDialogTitle>
					<AlertDialogDescription>
						This will permanently delete your PopcornTime account and all associated data. You will
						lose access to your watchlist, favorites, and viewing history.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Keep Account</AlertDialogCancel>
					<AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
						Delete Account
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
	parameters: {
		docs: {
			description: {
				story: "Alert dialog for destructive actions with appropriate styling",
			},
		},
	},
};

export const RemoveFromWatchlist: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="ghost" size="sm">
					Remove from Watchlist
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Remove from Watchlist?</AlertDialogTitle>
					<AlertDialogDescription>
						"Inception" will be removed from your watchlist. You can add it back anytime from the
						movie details page.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Keep in Watchlist</AlertDialogCancel>
					<AlertDialogAction>Remove</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
	parameters: {
		docs: {
			description: {
				story: "Alert dialog for removing items from watchlist",
			},
		},
	},
};

export const ClearDownloads: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline">Clear All Downloads</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Clear All Downloads?</AlertDialogTitle>
					<AlertDialogDescription>
						This will delete all downloaded movies and TV show episodes from your device. This will
						free up storage space but you'll need to download them again to watch offline.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
						Clear Downloads
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
	parameters: {
		docs: {
			description: {
				story: "Alert dialog for clearing downloaded content",
			},
		},
	},
};

export const SignOut: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="ghost">Sign Out</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Sign out of PopcornTime?</AlertDialogTitle>
					<AlertDialogDescription>
						You'll need to sign in again to access your personalized content, watchlist, and
						preferences.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Stay Signed In</AlertDialogCancel>
					<AlertDialogAction>Sign Out</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
	parameters: {
		docs: {
			description: {
				story: "Alert dialog for signing out of the application",
			},
		},
	},
};

export const UnsavedChanges: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline">Close Settings</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
					<AlertDialogDescription>
						You have unsaved changes to your preferences. If you close now, your changes will be
						lost.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Continue Editing</AlertDialogCancel>
					<AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
						Discard Changes
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
	parameters: {
		docs: {
			description: {
				story: "Alert dialog warning about unsaved changes",
			},
		},
	},
};

export const NetworkError: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline">Simulate Network Error</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Connection Failed</AlertDialogTitle>
					<AlertDialogDescription>
						Unable to connect to PopcornTime servers. Please check your internet connection and try
						again. If the problem persists, the service may be temporarily unavailable.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Go Offline</AlertDialogCancel>
					<AlertDialogAction>Retry Connection</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
	parameters: {
		docs: {
			description: {
				story: "Alert dialog for network connectivity issues",
			},
		},
	},
};

export const SingleAction: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline">Show Info</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Update Available</AlertDialogTitle>
					<AlertDialogDescription>
						PopcornTime 2.1.0 is now available! This update includes performance improvements, bug
						fixes, and new features. The update will be installed automatically when you restart the
						application.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction className="w-full">Got it</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
	parameters: {
		docs: {
			description: {
				story: "Alert dialog with single action button for informational messages",
			},
		},
	},
};

export const CustomStyling: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button>Custom Styled Dialog</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="max-w-lg">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-2xl flex items-center gap-2">
						🎬 Premium Features
					</AlertDialogTitle>
					<AlertDialogDescription className="text-base">
						Upgrade to PopcornTime Premium to unlock exclusive features like 4K streaming, ad-free
						experience, offline downloads, and access to premium content libraries.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="py-4">
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-sm">
							<div className="w-2 h-2 bg-green-500 rounded-full" />
							<span>4K Ultra HD Streaming</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<div className="w-2 h-2 bg-green-500 rounded-full" />
							<span>No Advertisements</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<div className="w-2 h-2 bg-green-500 rounded-full" />
							<span>Unlimited Downloads</span>
						</div>
					</div>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Maybe Later</AlertDialogCancel>
					<AlertDialogAction className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
						Upgrade Now
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
	parameters: {
		docs: {
			description: {
				story: "Alert dialog with custom styling and content layout",
			},
		},
	},
};
