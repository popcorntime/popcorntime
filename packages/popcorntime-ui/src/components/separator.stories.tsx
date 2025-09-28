import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "@popcorntime/ui/components/separator";

const meta = {
	title: "Components/Separator",
	component: Separator,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A separator component built with Radix UI primitives for visually or semantically separating content.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		orientation: {
			control: { type: "select" },
			options: ["horizontal", "vertical"],
			description: "The orientation of the separator",
		},
		decorative: {
			control: "boolean",
			description: "Whether the separator is purely decorative or has semantic meaning",
		},
	},
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
	render: () => (
		<div className="w-64">
			<div className="space-y-1">
				<h4 className="text-sm font-medium">Radix UI</h4>
				<p className="text-sm text-muted-foreground">An open-source UI component library.</p>
			</div>
			<Separator className="my-4" />
			<div className="flex h-5 items-center space-x-4 text-sm">
				<div>Blog</div>
				<Separator orientation="vertical" />
				<div>Docs</div>
				<Separator orientation="vertical" />
				<div>Source</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Horizontal separator dividing sections of content",
			},
		},
	},
};

export const Vertical: Story = {
	render: () => (
		<div className="flex h-5 items-center space-x-4 text-sm">
			<div>Blog</div>
			<Separator orientation="vertical" />
			<div>Docs</div>
			<Separator orientation="vertical" />
			<div>Source</div>
			<Separator orientation="vertical" />
			<div>Help</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Vertical separators between navigation items",
			},
		},
	},
};

export const InNavigation: Story = {
	render: () => (
		<div className="space-y-4">
			<nav className="flex items-center space-x-4 text-sm font-medium">
				<a href="#" className="text-foreground">
					Home
				</a>
				<Separator orientation="vertical" className="h-4" />
				<a href="#" className="text-muted-foreground">
					About
				</a>
				<Separator orientation="vertical" className="h-4" />
				<a href="#" className="text-muted-foreground">
					Services
				</a>
				<Separator orientation="vertical" className="h-4" />
				<a href="#" className="text-muted-foreground">
					Contact
				</a>
			</nav>

			<Separator />

			<div className="text-sm text-muted-foreground">Main content area</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Separators used in navigation with both vertical and horizontal orientations",
			},
		},
	},
};

export const InCard: Story = {
	render: () => (
		<div className="w-80 rounded-lg border bg-card p-6 shadow-sm">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">Card Title</h3>
				<span className="text-sm text-muted-foreground">$99</span>
			</div>

			<Separator className="my-4" />

			<div className="space-y-3">
				<div className="flex justify-between text-sm">
					<span>Feature 1</span>
					<span className="text-muted-foreground">✓</span>
				</div>
				<div className="flex justify-between text-sm">
					<span>Feature 2</span>
					<span className="text-muted-foreground">✓</span>
				</div>
				<div className="flex justify-between text-sm">
					<span>Feature 3</span>
					<span className="text-muted-foreground">✗</span>
				</div>
			</div>

			<Separator className="my-4" />

			<button className="w-full rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
				Choose Plan
			</button>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Separators used within a card to divide different sections",
			},
		},
	},
};

export const WithContent: Story = {
	render: () => (
		<div className="w-96 space-y-6">
			<div>
				<h2 className="text-lg font-semibold mb-2">Account Settings</h2>
				<div className="space-y-3">
					<div className="flex justify-between">
						<span className="text-sm">Email</span>
						<span className="text-sm text-muted-foreground">john@example.com</span>
					</div>
					<div className="flex justify-between">
						<span className="text-sm">Phone</span>
						<span className="text-sm text-muted-foreground">+1 (555) 123-4567</span>
					</div>
				</div>
			</div>

			<Separator />

			<div>
				<h2 className="text-lg font-semibold mb-2">Preferences</h2>
				<div className="space-y-3">
					<div className="flex justify-between">
						<span className="text-sm">Language</span>
						<span className="text-sm text-muted-foreground">English</span>
					</div>
					<div className="flex justify-between">
						<span className="text-sm">Timezone</span>
						<span className="text-sm text-muted-foreground">UTC-5</span>
					</div>
				</div>
			</div>

			<Separator />

			<div>
				<h2 className="text-lg font-semibold mb-2">Notifications</h2>
				<div className="space-y-3">
					<div className="flex justify-between">
						<span className="text-sm">Email notifications</span>
						<span className="text-sm text-muted-foreground">Enabled</span>
					</div>
					<div className="flex justify-between">
						<span className="text-sm">Push notifications</span>
						<span className="text-sm text-muted-foreground">Disabled</span>
					</div>
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Separators organizing different sections of a settings panel",
			},
		},
	},
};

export const CustomStyling: Story = {
	render: () => (
		<div className="w-64 space-y-4">
			<div className="text-center">
				<h3 className="font-medium">Default Separator</h3>
			</div>
			<Separator />

			<div className="text-center">
				<h3 className="font-medium">Thicker Separator</h3>
			</div>
			<Separator className="h-0.5" />

			<div className="text-center">
				<h3 className="font-medium">Colored Separator</h3>
			</div>
			<Separator className="bg-primary" />

			<div className="text-center">
				<h3 className="font-medium">Dashed Separator</h3>
			</div>
			<Separator className="border-t border-dashed border-border bg-transparent h-0" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Various separator styles including different thicknesses, colors, and border styles",
			},
		},
	},
};
