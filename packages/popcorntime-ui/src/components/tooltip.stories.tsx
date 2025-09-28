import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@popcorntime/ui/components/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@popcorntime/ui/components/tooltip";

const meta = {
	title: "Components/Tooltip",
	component: Tooltip,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A tooltip component built with Radix UI primitives. Shows contextual information on hover or focus.",
			},
		},
	},
	tags: ["autodocs"],
	decorators: [
		Story => (
			<TooltipProvider delayDuration={300}>
				<Story />
			</TooltipProvider>
		),
	],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button variant="outline">Hover me</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>This is a tooltip</p>
			</TooltipContent>
		</Tooltip>
	),
};

export const Positions: Story = {
	render: () => (
		<div className="grid grid-cols-3 gap-8 place-items-center min-h-[300px]">
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline" size="sm">
						Top
					</Button>
				</TooltipTrigger>
				<TooltipContent side="top">
					<p>Tooltip on top</p>
				</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline" size="sm">
						Right
					</Button>
				</TooltipTrigger>
				<TooltipContent side="right">
					<p>Tooltip on right</p>
				</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline" size="sm">
						Bottom
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom">
					<p>Tooltip on bottom</p>
				</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline" size="sm">
						Left
					</Button>
				</TooltipTrigger>
				<TooltipContent side="left">
					<p>Tooltip on left</p>
				</TooltipContent>
			</Tooltip>

			<div></div>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline" size="sm">
						Auto
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Auto-positioned tooltip</p>
				</TooltipContent>
			</Tooltip>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Tooltips positioned on different sides of the trigger element",
			},
		},
	},
};

export const WithIcon: Story = {
	render: () => (
		<div className="flex gap-4">
			<Tooltip>
				<TooltipTrigger asChild>
					<Button size="icon" variant="outline">
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Information</p>
				</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button size="icon" variant="outline">
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4v16m8-8H4"
							/>
						</svg>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Add new item</p>
				</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button size="icon" variant="outline">
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Delete item</p>
				</TooltipContent>
			</Tooltip>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Icon buttons with tooltips providing action context",
			},
		},
	},
};

export const LongContent: Story = {
	render: () => (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button variant="outline">Long tooltip</Button>
			</TooltipTrigger>
			<TooltipContent className="max-w-xs">
				<p>
					This is a longer tooltip with more detailed information that wraps to multiple lines when
					the content is too long for a single line.
				</p>
			</TooltipContent>
		</Tooltip>
	),
	parameters: {
		docs: {
			description: {
				story: "Tooltip with longer content that wraps to multiple lines",
			},
		},
	},
};

export const WithDelay: Story = {
	render: () => (
		<div className="flex gap-4">
			<TooltipProvider delayDuration={0}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="outline" size="sm">
							No delay
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Instant tooltip</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider delayDuration={500}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="outline" size="sm">
							500ms delay
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Delayed tooltip</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider delayDuration={1000}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="outline" size="sm">
							1s delay
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Very delayed tooltip</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Tooltips with different delay durations",
			},
		},
	},
};

export const Keyboard: Story = {
	render: () => (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button variant="outline">Focus me with Tab</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>Accessible via keyboard focus</p>
			</TooltipContent>
		</Tooltip>
	),
	parameters: {
		docs: {
			description: {
				story: "Tooltip that can be triggered via keyboard focus for accessibility",
			},
		},
	},
};
