import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "@popcorntime/ui/components/checkbox";
import { Input } from "@popcorntime/ui/components/input";
import { Label } from "@popcorntime/ui/components/label";

const meta = {
	title: "Components/Label",
	component: Label,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A label component built with Radix UI primitives, providing proper accessibility and styling for form elements.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		htmlFor: {
			control: "text",
			description: "The id of the form element this label is associated with",
		},
		children: {
			control: "text",
			description: "Label content",
		},
	},
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Label text",
	},
};

export const WithInput: Story = {
	render: () => (
		<div className="space-y-2">
			<Label htmlFor="email">Email address</Label>
			<Input id="email" type="email" placeholder="Enter your email" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Label properly associated with an input field using htmlFor and id",
			},
		},
	},
};

export const WithCheckbox: Story = {
	render: () => (
		<div className="flex items-center space-x-2">
			<Checkbox id="terms" />
			<Label htmlFor="terms">Accept terms and conditions</Label>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Label used with a checkbox component",
			},
		},
	},
};

export const Required: Story = {
	render: () => (
		<div className="space-y-2">
			<Label htmlFor="required-field">
				Username
				<span className="text-destructive ml-1">*</span>
			</Label>
			<Input id="required-field" placeholder="Enter username" required />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Label indicating a required field with asterisk",
			},
		},
	},
};

export const WithDescription: Story = {
	render: () => (
		<div className="space-y-2">
			<Label htmlFor="password">Password</Label>
			<Input id="password" type="password" placeholder="Enter password" />
			<p className="text-xs text-muted-foreground">
				Must be at least 8 characters long and contain a number
			</p>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Label with additional description text below the input",
			},
		},
	},
};

export const FormGroup: Story = {
	render: () => (
		<div className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="first-name">
					First Name
					<span className="text-destructive">*</span>
				</Label>
				<Input id="first-name" placeholder="Enter first name" required />
			</div>

			<div className="space-y-2">
				<Label htmlFor="last-name">
					Last Name
					<span className="text-destructive">*</span>
				</Label>
				<Input id="last-name" placeholder="Enter last name" required />
			</div>

			<div className="space-y-2">
				<Label htmlFor="bio">Bio (optional)</Label>
				<textarea
					id="bio"
					className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					placeholder="Tell us about yourself"
				/>
			</div>

			<div className="flex items-center space-x-2">
				<Checkbox id="newsletter" />
				<Label htmlFor="newsletter">Subscribe to our newsletter</Label>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Multiple form fields with properly associated labels",
			},
		},
	},
};

export const Disabled: Story = {
	render: () => (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="disabled-input">Disabled Field</Label>
				<Input id="disabled-input" placeholder="Cannot edit" disabled />
			</div>

			<div className="flex items-center space-x-2">
				<Checkbox id="disabled-checkbox" disabled />
				<Label htmlFor="disabled-checkbox">Disabled option</Label>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Labels with disabled form elements showing proper styling inheritance",
			},
		},
	},
};

export const Validation: Story = {
	render: () => (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="valid-input" className="text-green-600">
					Valid Field ✓
				</Label>
				<Input id="valid-input" value="john@example.com" className="border-green-500" />
			</div>

			<div className="space-y-2">
				<Label htmlFor="invalid-input" className="text-destructive">
					Invalid Field ✗
				</Label>
				<Input
					id="invalid-input"
					value="invalid-email"
					className="border-destructive"
					aria-invalid={true}
				/>
				<p className="text-xs text-destructive">Please enter a valid email address</p>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Labels styled to indicate validation states",
			},
		},
	},
};
