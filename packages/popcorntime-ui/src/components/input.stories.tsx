import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@popcorntime/ui/components/input";

const meta = {
	title: "Components/Input",
	component: Input,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A styled input component with focus states, validation styling, and file upload support.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		type: {
			control: { type: "select" },
			options: ["text", "email", "password", "number", "tel", "url", "search", "file"],
			description: "HTML input type",
		},
		placeholder: {
			control: "text",
			description: "Placeholder text",
		},
		disabled: {
			control: "boolean",
			description: "Whether the input is disabled",
		},
		className: {
			control: "text",
			description: "Additional CSS classes",
		},
	},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		placeholder: "Enter text...",
	},
};

export const Types: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-80">
			<Input type="text" placeholder="Text input" />
			<Input type="email" placeholder="Email input" />
			<Input type="password" placeholder="Password input" />
			<Input type="number" placeholder="Number input" />
			<Input type="search" placeholder="Search input" />
			<Input type="tel" placeholder="Phone input" />
			<Input type="url" placeholder="URL input" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Different input types with appropriate placeholders",
			},
		},
	},
};

export const States: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-80">
			<Input placeholder="Default state" />
			<Input placeholder="Disabled state" disabled />
			<Input placeholder="With value" defaultValue="Some text content" />
			<Input placeholder="Focus to see ring" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Different input states including disabled and focused",
			},
		},
	},
};

export const Validation: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-80">
			<div>
				<label className="text-sm font-medium mb-2 block">Valid input</label>
				<Input placeholder="This is valid" />
			</div>
			<div>
				<label className="text-sm font-medium mb-2 block">Invalid input</label>
				<Input placeholder="This has errors" aria-invalid={true} />
				<p className="text-sm text-destructive mt-1">This field has an error</p>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Input validation states using aria-invalid attribute",
			},
		},
	},
};

export const FileUpload: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-80">
			<div>
				<label className="text-sm font-medium mb-2 block">File upload</label>
				<Input type="file" />
			</div>
			<div>
				<label className="text-sm font-medium mb-2 block">Multiple files</label>
				<Input type="file" multiple />
			</div>
			<div>
				<label className="text-sm font-medium mb-2 block">Image files only</label>
				<Input type="file" accept="image/*" />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "File upload inputs with different configurations",
			},
		},
	},
};

export const WithLabel: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-80">
			<div className="space-y-2">
				<label htmlFor="email" className="text-sm font-medium">
					Email address
				</label>
				<Input id="email" type="email" placeholder="john@example.com" required />
			</div>
			<div className="space-y-2">
				<label htmlFor="password" className="text-sm font-medium">
					Password
				</label>
				<Input id="password" type="password" placeholder="Enter your password" required />
				<p className="text-xs text-muted-foreground">Must be at least 8 characters long</p>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Input components with proper labels and helper text",
			},
		},
	},
};
