import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "@popcorntime/ui/components/button";
import { Input } from "@popcorntime/ui/components/input";
import { Label } from "@popcorntime/ui/components/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@popcorntime/ui/components/tabs";

const meta = {
	title: "Components/Tabs",
	component: Tabs,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A tab component built with Radix UI primitives for organizing content into sections.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		defaultValue: {
			control: "text",
			description: "The default active tab",
		},
		value: {
			control: "text",
			description: "The controlled active tab value",
		},
		orientation: {
			control: { type: "select" },
			options: ["horizontal", "vertical"],
			description: "The orientation of the tabs",
		},
		onValueChange: {
			action: "onValueChange",
			description: "Callback when tab changes",
		},
	},
	args: {
		onValueChange: fn(),
	},
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Tabs defaultValue="account" className="w-96">
			<TabsList>
				<TabsTrigger value="account">Account</TabsTrigger>
				<TabsTrigger value="password">Password</TabsTrigger>
			</TabsList>
			<TabsContent value="account" className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="name">Name</Label>
					<Input id="name" defaultValue="John Doe" />
				</div>
				<div className="space-y-2">
					<Label htmlFor="username">Username</Label>
					<Input id="username" defaultValue="@johndoe" />
				</div>
				<Button>Save changes</Button>
			</TabsContent>
			<TabsContent value="password" className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="current">Current password</Label>
					<Input id="current" type="password" />
				</div>
				<div className="space-y-2">
					<Label htmlFor="new">New password</Label>
					<Input id="new" type="password" />
				</div>
				<Button>Update password</Button>
			</TabsContent>
		</Tabs>
	),
};

export const WithIcons: Story = {
	render: () => (
		<Tabs defaultValue="overview" className="w-96">
			<TabsList>
				<TabsTrigger value="overview">
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
						/>
					</svg>
					Overview
				</TabsTrigger>
				<TabsTrigger value="analytics">
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
						/>
					</svg>
					Analytics
				</TabsTrigger>
				<TabsTrigger value="settings">
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
					Settings
				</TabsTrigger>
			</TabsList>
			<TabsContent value="overview" className="space-y-4">
				<h3 className="text-lg font-semibold">Overview</h3>
				<p className="text-sm text-muted-foreground">
					Get a quick overview of your account activity and performance metrics.
				</p>
				<div className="grid grid-cols-2 gap-4">
					<div className="p-4 border rounded-lg">
						<div className="text-2xl font-bold">1,234</div>
						<div className="text-sm text-muted-foreground">Total Users</div>
					</div>
					<div className="p-4 border rounded-lg">
						<div className="text-2xl font-bold">567</div>
						<div className="text-sm text-muted-foreground">Active Sessions</div>
					</div>
				</div>
			</TabsContent>
			<TabsContent value="analytics" className="space-y-4">
				<h3 className="text-lg font-semibold">Analytics</h3>
				<p className="text-sm text-muted-foreground">
					View detailed analytics and insights about your application usage.
				</p>
				<div className="h-32 bg-muted rounded-lg flex items-center justify-center">
					<span className="text-sm text-muted-foreground">Chart placeholder</span>
				</div>
			</TabsContent>
			<TabsContent value="settings" className="space-y-4">
				<h3 className="text-lg font-semibold">Settings</h3>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="app-name">Application Name</Label>
						<Input id="app-name" defaultValue="My App" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<textarea
							id="description"
							className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
							placeholder="Enter description"
						/>
					</div>
					<Button>Save Settings</Button>
				</div>
			</TabsContent>
		</Tabs>
	),
	parameters: {
		docs: {
			description: {
				story: "Tabs with icons for visual enhancement",
			},
		},
	},
};

export const ThreeTabs: Story = {
	render: () => (
		<Tabs defaultValue="tab1" className="w-96">
			<TabsList className="w-full">
				<TabsTrigger value="tab1" className="flex-1">
					Tab 1
				</TabsTrigger>
				<TabsTrigger value="tab2" className="flex-1">
					Tab 2
				</TabsTrigger>
				<TabsTrigger value="tab3" className="flex-1">
					Tab 3
				</TabsTrigger>
			</TabsList>
			<TabsContent value="tab1">
				<div className="p-4 border rounded-lg">
					<h4 className="font-semibold mb-2">First Tab Content</h4>
					<p className="text-sm text-muted-foreground">
						This is the content for the first tab. It can contain any elements.
					</p>
				</div>
			</TabsContent>
			<TabsContent value="tab2">
				<div className="p-4 border rounded-lg">
					<h4 className="font-semibold mb-2">Second Tab Content</h4>
					<p className="text-sm text-muted-foreground">
						This is the content for the second tab with different information.
					</p>
				</div>
			</TabsContent>
			<TabsContent value="tab3">
				<div className="p-4 border rounded-lg">
					<h4 className="font-semibold mb-2">Third Tab Content</h4>
					<p className="text-sm text-muted-foreground">
						This is the content for the third tab showing more details.
					</p>
				</div>
			</TabsContent>
		</Tabs>
	),
	parameters: {
		docs: {
			description: {
				story: "Three-tab layout with equal width distribution",
			},
		},
	},
};

export const CompactTabs: Story = {
	render: () => (
		<Tabs defaultValue="general" className="w-80">
			<TabsList className="h-8">
				<TabsTrigger value="general" className="text-xs">
					General
				</TabsTrigger>
				<TabsTrigger value="security" className="text-xs">
					Security
				</TabsTrigger>
				<TabsTrigger value="billing" className="text-xs">
					Billing
				</TabsTrigger>
				<TabsTrigger value="team" className="text-xs">
					Team
				</TabsTrigger>
			</TabsList>
			<TabsContent value="general" className="mt-3">
				<div className="text-sm space-y-3">
					<div>
						<Label className="text-xs">Profile Name</Label>
						<Input className="h-8 text-xs" defaultValue="John Doe" />
					</div>
					<div>
						<Label className="text-xs">Email</Label>
						<Input className="h-8 text-xs" type="email" defaultValue="john@example.com" />
					</div>
				</div>
			</TabsContent>
			<TabsContent value="security" className="mt-3">
				<div className="text-sm space-y-3">
					<div>
						<Label className="text-xs">Two-factor Authentication</Label>
						<div className="text-xs text-muted-foreground mt-1">Enabled</div>
					</div>
					<div>
						<Label className="text-xs">Last Sign In</Label>
						<div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
					</div>
				</div>
			</TabsContent>
			<TabsContent value="billing" className="mt-3">
				<div className="text-sm space-y-3">
					<div>
						<Label className="text-xs">Current Plan</Label>
						<div className="text-xs text-muted-foreground mt-1">Pro ($19/month)</div>
					</div>
					<div>
						<Label className="text-xs">Next Billing Date</Label>
						<div className="text-xs text-muted-foreground mt-1">January 15, 2024</div>
					</div>
				</div>
			</TabsContent>
			<TabsContent value="team" className="mt-3">
				<div className="text-sm space-y-3">
					<div>
						<Label className="text-xs">Team Members</Label>
						<div className="text-xs text-muted-foreground mt-1">5 members</div>
					</div>
					<div>
						<Label className="text-xs">Team Plan</Label>
						<div className="text-xs text-muted-foreground mt-1">Business</div>
					</div>
				</div>
			</TabsContent>
		</Tabs>
	),
	parameters: {
		docs: {
			description: {
				story: "Compact tabs with smaller sizing for dense interfaces",
			},
		},
	},
};

export const DisabledTab: Story = {
	render: () => (
		<Tabs defaultValue="available" className="w-96">
			<TabsList>
				<TabsTrigger value="available">Available</TabsTrigger>
				<TabsTrigger value="disabled" disabled>
					Disabled
				</TabsTrigger>
				<TabsTrigger value="coming-soon" disabled>
					Coming Soon
				</TabsTrigger>
			</TabsList>
			<TabsContent value="available" className="space-y-4">
				<h4 className="font-semibold">Available Content</h4>
				<p className="text-sm text-muted-foreground">
					This tab is available and can be interacted with.
				</p>
			</TabsContent>
			<TabsContent value="disabled">
				<p className="text-sm text-muted-foreground">This content should not be accessible.</p>
			</TabsContent>
			<TabsContent value="coming-soon">
				<p className="text-sm text-muted-foreground">This content is coming soon.</p>
			</TabsContent>
		</Tabs>
	),
	parameters: {
		docs: {
			description: {
				story: "Tabs with disabled states for unavailable or restricted content",
			},
		},
	},
};
