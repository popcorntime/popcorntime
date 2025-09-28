import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Checkbox } from "@popcorntime/ui/components/checkbox";

const meta = {
	title: "Components/Checkbox",
	component: Checkbox,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A checkbox component built with Radix UI primitives, featuring proper accessibility and styling.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		checked: {
			control: "boolean",
			description: "The checked state of the checkbox",
		},
		disabled: {
			control: "boolean",
			description: "Whether the checkbox is disabled",
		},
		required: {
			control: "boolean",
			description: "Whether the checkbox is required",
		},
		onCheckedChange: {
			action: "onCheckedChange",
			description: "Callback when checked state changes",
		},
	},
	args: {
		onCheckedChange: fn(),
	},
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const Checked: Story = {
	args: {
		checked: true,
	},
};

export const Indeterminate: Story = {
	args: {
		checked: "indeterminate",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Checkbox in indeterminate state, useful for parent checkboxes in hierarchical lists",
			},
		},
	},
};

export const Disabled: Story = {
	render: () => (
		<div className="flex gap-4 items-center">
			<Checkbox disabled />
			<Checkbox disabled checked />
			<Checkbox disabled checked="indeterminate" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Disabled checkboxes in different states",
			},
		},
	},
};

export const WithLabel: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<div className="flex items-center space-x-2">
				<Checkbox id="terms" />
				<label
					htmlFor="terms"
					className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Accept terms and conditions
				</label>
			</div>

			<div className="flex items-center space-x-2">
				<Checkbox id="newsletter" checked />
				<label
					htmlFor="newsletter"
					className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Subscribe to newsletter
				</label>
			</div>

			<div className="flex items-center space-x-2">
				<Checkbox id="disabled" disabled />
				<label
					htmlFor="disabled"
					className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					This option is disabled
				</label>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Checkboxes with proper labels using htmlFor and id attributes",
			},
		},
	},
};

export const FormGroup: Story = {
	render: () => (
		<div className="space-y-4">
			<fieldset className="space-y-3">
				<legend className="text-sm font-medium">Notification Preferences</legend>

				<div className="flex items-center space-x-2">
					<Checkbox id="email" checked />
					<label htmlFor="email" className="text-sm leading-none">
						Email notifications
					</label>
				</div>

				<div className="flex items-center space-x-2">
					<Checkbox id="push" />
					<label htmlFor="push" className="text-sm leading-none">
						Push notifications
					</label>
				</div>

				<div className="flex items-center space-x-2">
					<Checkbox id="sms" />
					<label htmlFor="sms" className="text-sm leading-none">
						SMS notifications
					</label>
				</div>

				<div className="flex items-center space-x-2">
					<Checkbox id="phone" disabled />
					<label htmlFor="phone" className="text-sm leading-none peer-disabled:opacity-70">
						Phone calls (coming soon)
					</label>
				</div>
			</fieldset>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Group of related checkboxes with fieldset and legend for semantic structure",
			},
		},
	},
};

export const Validation: Story = {
	render: () => (
		<div className="space-y-4">
			<div className="space-y-2">
				<div className="flex items-center space-x-2">
					<Checkbox id="valid" checked />
					<label htmlFor="valid" className="text-sm leading-none">
						Valid selection
					</label>
				</div>
			</div>

			<div className="space-y-2">
				<div className="flex items-center space-x-2">
					<Checkbox id="invalid" aria-invalid={true} />
					<label htmlFor="invalid" className="text-sm leading-none">
						Invalid selection
					</label>
				</div>
				<p className="text-sm text-destructive">This field is required</p>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Checkbox validation states using aria-invalid attribute",
			},
		},
	},
};

export const ListSelection: Story = {
	render: () => {
		const items = [
			{ id: "all", label: "Select All", checked: "indeterminate" as const },
			{ id: "item1", label: "First Item", checked: true },
			{ id: "item2", label: "Second Item", checked: true },
			{ id: "item3", label: "Third Item", checked: false },
		];

		return (
			<div className="space-y-2">
				{items.map((item, index) => (
					<div
						key={item.id}
						className={`flex items-center space-x-2 ${index === 0 ? "border-b pb-2 mb-2" : ""}`}
					>
						<Checkbox id={item.id} checked={item.checked} />
						<label
							htmlFor={item.id}
							className={`text-sm leading-none ${index === 0 ? "font-medium" : ""}`}
						>
							{item.label}
						</label>
					</div>
				))}
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "Hierarchical checkbox list with parent checkbox in indeterminate state",
			},
		},
	},
};
