import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Toggle } from "@popcorntime/ui/components/toggle";

const meta = {
	title: "Components/Toggle",
	component: Toggle,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A toggle button component with pressed/unpressed states, built with Radix UI Toggle primitives.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["default", "outline"],
			description: "The visual variant of the toggle",
		},
		size: {
			control: { type: "select" },
			options: ["default", "sm", "lg"],
			description: "The size of the toggle",
		},
		pressed: {
			control: "boolean",
			description: "Whether the toggle is pressed",
		},
		disabled: {
			control: "boolean",
			description: "Whether the toggle is disabled",
		},
		children: {
			control: "text",
			description: "Toggle content",
		},
	},
	args: {
		onPressedChange: fn(),
		children: "Toggle",
	},
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Toggle",
	},
};

export const Variants: Story = {
	render: () => (
		<div className="flex gap-4 items-center">
			<Toggle variant="default">Default</Toggle>
			<Toggle variant="outline">Outline</Toggle>
			<Toggle variant="default" pressed>
				Default Pressed
			</Toggle>
			<Toggle variant="outline" pressed>
				Outline Pressed
			</Toggle>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Different toggle variants in both pressed and unpressed states",
			},
		},
	},
};

export const Sizes: Story = {
	render: () => (
		<div className="flex gap-4 items-center">
			<Toggle size="sm">Small</Toggle>
			<Toggle size="default">Default</Toggle>
			<Toggle size="lg">Large</Toggle>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Different toggle sizes",
			},
		},
	},
};

export const WithIcon: Story = {
	render: () => (
		<div className="flex gap-4 items-center">
			<Toggle>
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
					/>
				</svg>
				Favorite
			</Toggle>

			<Toggle pressed>
				<svg className="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
					/>
				</svg>
				Favorited
			</Toggle>

			<Toggle size="sm" variant="outline">
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
					/>
				</svg>
			</Toggle>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Toggle buttons with icons, showing both text+icon and icon-only variants",
			},
		},
	},
};

export const IconOnly: Story = {
	render: () => (
		<div className="flex gap-4 items-center">
			<Toggle size="sm" aria-label="Bold">
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M6 12h9m-9-6h9m-9 12h9"
					/>
				</svg>
			</Toggle>

			<Toggle aria-label="Italic">
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M10 6L8 6 6 18l2 0"
					/>
				</svg>
			</Toggle>

			<Toggle size="lg" aria-label="Underline">
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 3v9a3 3 0 003 3h0a3 3 0 003-3V3M7 21h10"
					/>
				</svg>
			</Toggle>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Icon-only toggles with proper aria-labels for accessibility",
			},
		},
	},
};

export const Disabled: Story = {
	render: () => (
		<div className="flex gap-4 items-center">
			<Toggle disabled>Disabled</Toggle>
			<Toggle disabled pressed>
				Disabled Pressed
			</Toggle>
			<Toggle variant="outline" disabled>
				Disabled Outline
			</Toggle>
			<Toggle variant="outline" disabled pressed>
				Disabled Outline Pressed
			</Toggle>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Disabled toggle states for different variants",
			},
		},
	},
};

export const Toolbar: Story = {
	render: () => (
		<div className="flex items-center border border-border rounded-md p-1">
			<Toggle size="sm" aria-label="Bold">
				<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
					<path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
				</svg>
			</Toggle>
			<Toggle size="sm" aria-label="Italic">
				<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
					<path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
				</svg>
			</Toggle>
			<Toggle size="sm" aria-label="Underline">
				<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
				</svg>
			</Toggle>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Toggle buttons grouped together in a toolbar layout",
			},
		},
	},
};
