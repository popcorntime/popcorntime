import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "@popcorntime/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@popcorntime/ui/components/dialog";
import { Input } from "@popcorntime/ui/components/input";

const meta = {
	title: "Components/Dialog",
	component: Dialog,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A modal dialog component built with Radix UI Dialog primitives. Supports overlay, header, footer, and proper focus management.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		open: {
			control: "boolean",
			description: "Whether the dialog is open",
		},
		onOpenChange: {
			action: "onOpenChange",
			description: "Callback when dialog open state changes",
		},
	},
	args: {
		onOpenChange: fn(),
	},
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Open Dialog</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Dialog Title</DialogTitle>
					<DialogDescription>
						This is a description of what the dialog is for. It provides context about the action
						that will be performed.
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<p className="text-sm text-muted-foreground">
						This is the main content area of the dialog.
					</p>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button>Continue</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};

export const WithForm: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Create Account</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Create Account</DialogTitle>
					<DialogDescription>Fill out the form below to create your new account.</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<label htmlFor="name" className="text-sm font-medium">
							Full Name
						</label>
						<Input id="name" placeholder="Enter your full name" />
					</div>
					<div className="space-y-2">
						<label htmlFor="email" className="text-sm font-medium">
							Email
						</label>
						<Input id="email" type="email" placeholder="Enter your email" />
					</div>
					<div className="space-y-2">
						<label htmlFor="password" className="text-sm font-medium">
							Password
						</label>
						<Input id="password" type="password" placeholder="Enter your password" />
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button type="submit">Create Account</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
	parameters: {
		docs: {
			description: {
				story: "Dialog with a form containing multiple input fields",
			},
		},
	},
};

export const Confirmation: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="destructive">Delete Item</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete the item from our servers.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2">
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button variant="destructive">Delete</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
	parameters: {
		docs: {
			description: {
				story: "Confirmation dialog with destructive action styling",
			},
		},
	},
};

export const LongContent: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">View Terms</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
				<DialogHeader>
					<DialogTitle>Terms of Service</DialogTitle>
					<DialogDescription>Please read our terms of service carefully.</DialogDescription>
				</DialogHeader>
				<div className="overflow-y-auto py-4 text-sm">
					<h3 className="font-semibold mb-2">1. Introduction</h3>
					<p className="mb-4 text-muted-foreground">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
						exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
					</p>
					<h3 className="font-semibold mb-2">2. User Responsibilities</h3>
					<p className="mb-4 text-muted-foreground">
						Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
						nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
						officia deserunt mollit anim id est laborum.
					</p>
					<h3 className="font-semibold mb-2">3. Privacy Policy</h3>
					<p className="mb-4 text-muted-foreground">
						Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
						laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
						architecto beatae vitae dicta sunt explicabo.
					</p>
					<h3 className="font-semibold mb-2">4. Limitations</h3>
					<p className="mb-4 text-muted-foreground">
						Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
						consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
					</p>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Decline</Button>
					</DialogClose>
					<Button>Accept</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
	parameters: {
		docs: {
			description: {
				story: "Dialog with scrollable content for long text",
			},
		},
	},
};
