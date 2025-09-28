import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@popcorntime/ui/components/button";
import { Spinner } from "@popcorntime/ui/components/spinner";

const meta = {
	title: "Components/Spinner",
	component: Spinner,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "Loading spinner component to indicate processing or loading states.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: { type: "select" },
			options: ["small", "medium", "large"],
			description: "Size variant of the spinner",
		},
		show: {
			control: "boolean",
			description: "Whether to show the spinner",
		},
		className: {
			control: "text",
			description: "Additional CSS classes",
		},
	},
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-8">
			<div className="text-center">
				<Spinner size="small" />
				<p className="text-xs mt-2 text-muted-foreground">Small</p>
			</div>
			<div className="text-center">
				<Spinner size="medium" />
				<p className="text-xs mt-2 text-muted-foreground">Medium</p>
			</div>
			<div className="text-center">
				<Spinner size="large" />
				<p className="text-xs mt-2 text-muted-foreground">Large</p>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Different spinner sizes",
			},
		},
	},
};

export const LoadingButton: Story = {
	render: () => (
		<div className="flex gap-4">
			<Button disabled className="gap-2">
				<Spinner size="small" />
				Loading...
			</Button>
			<Button variant="outline" disabled className="gap-2">
				<Spinner size="small" />
				Saving
			</Button>
			<Button variant="secondary" disabled className="gap-2">
				<Spinner size="small" />
				Processing
			</Button>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Spinner used in loading buttons",
			},
		},
	},
};

export const MovieLoading: Story = {
	render: () => (
		<div className="flex flex-col items-center gap-4 p-8">
			<div className="text-center space-y-4">
				<Spinner size="large" />
				<div>
					<h3 className="text-lg font-semibold">Loading Movie Details</h3>
					<p className="text-sm text-muted-foreground">Fetching information for "Inception"...</p>
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Spinner used while loading movie details",
			},
		},
	},
};

export const SearchLoading: Story = {
	render: () => (
		<div className="flex flex-col items-center gap-4 p-8">
			<Spinner size="large" />
			<div className="text-center">
				<h3 className="font-semibold">Searching...</h3>
				<p className="text-sm text-muted-foreground">
					Finding movies and TV shows matching your query
				</p>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Spinner used during search operations",
			},
		},
	},
};

export const StreamingLoading: Story = {
	render: () => (
		<div className="bg-black text-white p-12 rounded-lg text-center">
			<div className="space-y-6">
				<Spinner size="large" className="text-white" />
				<div>
					<h3 className="text-xl font-semibold">Preparing Stream</h3>
					<p className="text-sm text-gray-400">Connecting to torrent peers...</p>
					<div className="mt-4 w-64 bg-gray-800 rounded-full h-2 mx-auto">
						<div className="bg-blue-500 h-2 rounded-full w-1/3 animate-pulse"></div>
					</div>
					<p className="text-xs text-gray-500 mt-2">33% complete</p>
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Spinner used while preparing video stream",
			},
		},
	},
};

export const InlineLoading: Story = {
	render: () => (
		<div className="space-y-4 max-w-md">
			<div className="flex items-center gap-2 p-3 border rounded">
				<Spinner size="small" />
				<span className="text-sm">Loading watchlist...</span>
			</div>

			<div className="flex items-center gap-2 p-3 border rounded">
				<Spinner size="small" />
				<span className="text-sm">Syncing favorites...</span>
			</div>

			<div className="flex items-center gap-2 p-3 border rounded">
				<Spinner size="small" />
				<span className="text-sm">Checking for updates...</span>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Inline spinners for background operations",
			},
		},
	},
};

export const CardLoading: Story = {
	render: () => (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="border rounded-lg p-6">
				<div className="flex flex-col items-center gap-4 py-8">
					<Spinner />
					<p className="text-sm text-muted-foreground">Loading trending movies...</p>
				</div>
			</div>

			<div className="border rounded-lg p-6">
				<div className="flex flex-col items-center gap-4 py-8">
					<Spinner />
					<p className="text-sm text-muted-foreground">Loading TV shows...</p>
				</div>
			</div>

			<div className="border rounded-lg p-6">
				<div className="flex flex-col items-center gap-4 py-8">
					<Spinner />
					<p className="text-sm text-muted-foreground">Loading recommendations...</p>
				</div>
			</div>

			<div className="border rounded-lg p-6">
				<div className="flex flex-col items-center gap-4 py-8">
					<Spinner />
					<p className="text-sm text-muted-foreground">Loading your watchlist...</p>
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Spinners in content cards while data loads",
			},
		},
	},
};

export const FullScreenLoading: Story = {
	render: () => (
		<div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
			<div className="text-center space-y-4">
				<Spinner size="large" />
				<div>
					<h2 className="text-2xl font-semibold">PopcornTime</h2>
					<p className="text-muted-foreground">Loading your entertainment...</p>
				</div>
			</div>
		</div>
	),
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				story: "Full screen loading overlay",
			},
		},
	},
};

export const CustomColors: Story = {
	render: () => (
		<div className="flex items-center gap-8 p-4">
			<div className="text-center">
				<Spinner className="text-blue-500" />
				<p className="text-xs mt-2">Blue</p>
			</div>
			<div className="text-center">
				<Spinner className="text-green-500" />
				<p className="text-xs mt-2">Green</p>
			</div>
			<div className="text-center">
				<Spinner className="text-red-500" />
				<p className="text-xs mt-2">Red</p>
			</div>
			<div className="text-center">
				<Spinner className="text-purple-500" />
				<p className="text-xs mt-2">Purple</p>
			</div>
			<div className="text-center bg-black p-4 rounded">
				<Spinner className="text-white" />
				<p className="text-xs mt-2 text-white">White</p>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Spinner with custom colors using CSS classes",
			},
		},
	},
};

export const WithText: Story = {
	render: () => (
		<div className="space-y-6">
			<Spinner size="small">
				<p className="text-sm text-muted-foreground mt-2">Loading...</p>
			</Spinner>

			<Spinner size="medium">
				<p className="text-sm text-muted-foreground mt-3">Fetching data...</p>
			</Spinner>

			<Spinner size="large">
				<div className="mt-4 text-center">
					<p className="font-semibold">Please wait</p>
					<p className="text-sm text-muted-foreground">Loading content...</p>
				</div>
			</Spinner>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Spinner with accompanying text content",
			},
		},
	},
};

export const ConditionalShow: Story = {
	render: () => (
		<div className="space-y-4">
			<div>
				<p className="mb-2 text-sm font-medium">Visible (show=true)</p>
				<Spinner show={true} />
			</div>

			<div>
				<p className="mb-2 text-sm font-medium">Hidden (show=false)</p>
				<Spinner show={false} />
				<p className="text-xs text-muted-foreground">Spinner is hidden but space is preserved</p>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Conditionally showing/hiding the spinner",
			},
		},
	},
};
