import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@popcorntime/ui/components/badge.js";

const meta = {
	title: "Components/Badge",
	component: Badge,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "A small label component for displaying status, categories, or other metadata.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["default", "secondary", "destructive", "outline"],
			description: "The visual variant of the badge",
		},
		children: {
			control: "text",
			description: "Badge content",
		},
	},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Badge",
	},
};

export const Variants: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2 items-center">
			<Badge variant="default">Default</Badge>
			<Badge variant="secondary">Secondary</Badge>
			<Badge variant="destructive">Destructive</Badge>
			<Badge variant="outline">Outline</Badge>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "All available badge variants",
			},
		},
	},
};

export const Status: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2 items-center">
			<Badge variant="default">Active</Badge>
			<Badge variant="secondary">Pending</Badge>
			<Badge variant="destructive">Error</Badge>
			<Badge variant="outline">Draft</Badge>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Badges used to indicate different statuses",
			},
		},
	},
};

export const WithIcon: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2 items-center">
			<Badge variant="default" className="gap-1">
				<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
					<path
						fillRule="evenodd"
						d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
						clipRule="evenodd"
					/>
				</svg>
				Completed
			</Badge>

			<Badge variant="destructive" className="gap-1">
				<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
					<path
						fillRule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clipRule="evenodd"
					/>
				</svg>
				Failed
			</Badge>

			<Badge variant="secondary" className="gap-1">
				<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
					<path
						fillRule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
						clipRule="evenodd"
					/>
				</svg>
				Processing
			</Badge>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Badges with icons to provide visual context",
			},
		},
	},
};

export const Numbers: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2 items-center">
			<Badge variant="default">1</Badge>
			<Badge variant="default">99+</Badge>
			<Badge variant="secondary">42</Badge>
			<Badge variant="outline">0</Badge>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Badges displaying numbers or counts",
			},
		},
	},
};

export const Categories: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2 items-center max-w-md">
			<Badge variant="outline">React</Badge>
			<Badge variant="outline">TypeScript</Badge>
			<Badge variant="outline">Tailwind CSS</Badge>
			<Badge variant="outline">Storybook</Badge>
			<Badge variant="outline">Accessibility</Badge>
			<Badge variant="outline">Design System</Badge>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Badges used as category tags or labels",
			},
		},
	},
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2 items-center">
			<Badge className="text-xs px-2 py-0.5">Small</Badge>
			<Badge className="text-sm px-3 py-1">Medium</Badge>
			<Badge className="text-base px-4 py-1.5">Large</Badge>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Custom badge sizes using className overrides",
			},
		},
	},
};
