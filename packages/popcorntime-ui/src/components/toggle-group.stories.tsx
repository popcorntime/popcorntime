import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bold, Film, Grid, Italic, LayoutGrid, List, Star, Tv, Underline } from "lucide-react";
import { fn } from "storybook/test";
import { ToggleGroup, ToggleGroupItem } from "@popcorntime/ui/components/toggle-group";

const meta = {
	title: "Components/ToggleGroup",
	component: ToggleGroup,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A set of two-state buttons that can either be pressed (on) or not pressed (off).",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		type: {
			control: { type: "select" },
			options: ["single", "multiple"],
			description: "Determines whether one or multiple items can be pressed at a time",
		},
		value: {
			control: "text",
			description: 'The controlled value of the pressed item when type is "single"',
		},
		defaultValue: {
			control: "text",
			description: "The value of the item to show as pressed when initially rendered",
		},
		onValueChange: {
			action: "onValueChange",
			description: "Event handler called when the pressed state of an item changes",
		},
		disabled: {
			control: "boolean",
			description: "Whether the toggle group is disabled",
		},
		orientation: {
			control: { type: "select" },
			options: ["horizontal", "vertical"],
			description: "The orientation of the component",
		},
	},
	args: {
		onValueChange: fn(),
	},
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		type: "multiple",
	},
	render: args => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="bold" aria-label="Toggle bold">
				<Bold className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Toggle italic">
				<Italic className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Toggle underline">
				<Underline className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

export const Single: Story = {
	args: {
		type: "single",
		defaultValue: "movies",
	},
	render: args => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="movies" aria-label="Movies">
				<Film className="h-4 w-4 mr-2" />
				Movies
			</ToggleGroupItem>
			<ToggleGroupItem value="tv" aria-label="TV Shows">
				<Tv className="h-4 w-4 mr-2" />
				TV Shows
			</ToggleGroupItem>
			<ToggleGroupItem value="favorites" aria-label="Favorites">
				<Star className="h-4 w-4 mr-2" />
				Favorites
			</ToggleGroupItem>
		</ToggleGroup>
	),
	parameters: {
		docs: {
			description: {
				story: "Toggle group with single selection, like radio buttons",
			},
		},
	},
};

export const Multiple: Story = {
	args: {
		type: "multiple",
		defaultValue: ["bold", "italic"],
	},
	render: args => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="bold" aria-label="Bold">
				<Bold className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Italic">
				<Italic className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Underline">
				<Underline className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
	parameters: {
		docs: {
			description: {
				story: "Toggle group allowing multiple selections, like checkboxes",
			},
		},
	},
};

export const ViewModes: Story = {
	args: {
		type: "single",
		defaultValue: "grid",
	},
	render: args => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="grid" aria-label="Grid view">
				<Grid className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="list" aria-label="List view">
				<List className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="card" aria-label="Card view">
				<LayoutGrid className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
	parameters: {
		docs: {
			description: {
				story: "Toggle group for switching between different view modes",
			},
		},
	},
};

export const WithLabels: Story = {
	args: {
		type: "single",
		defaultValue: "all",
	},
	render: args => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="all">All Content</ToggleGroupItem>
			<ToggleGroupItem value="movies">Movies</ToggleGroupItem>
			<ToggleGroupItem value="tv">TV Shows</ToggleGroupItem>
			<ToggleGroupItem value="documentaries">Documentaries</ToggleGroupItem>
		</ToggleGroup>
	),
	parameters: {
		docs: {
			description: {
				story: "Toggle group with text labels for content filtering",
			},
		},
	},
};

export const QualitySelector: Story = {
	args: {
		type: "single",
		defaultValue: "1080p",
	},
	render: args => (
		<div className="space-y-4">
			<div>
				<h3 className="text-sm font-medium mb-2">Video Quality</h3>
				<ToggleGroup {...args}>
					<ToggleGroupItem value="720p">720p</ToggleGroupItem>
					<ToggleGroupItem value="1080p">1080p</ToggleGroupItem>
					<ToggleGroupItem value="1440p">1440p</ToggleGroupItem>
					<ToggleGroupItem value="4k">4K</ToggleGroupItem>
				</ToggleGroup>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Toggle group for selecting video quality in PopcornTime",
			},
		},
	},
};

export const Filters: Story = {
	args: {
		type: "multiple",
		defaultValue: ["action", "comedy"],
	},
	render: args => (
		<div className="space-y-4">
			<div>
				<h3 className="text-sm font-medium mb-2">Genre Filters</h3>
				<ToggleGroup {...args}>
					<ToggleGroupItem value="action">Action</ToggleGroupItem>
					<ToggleGroupItem value="comedy">Comedy</ToggleGroupItem>
					<ToggleGroupItem value="drama">Drama</ToggleGroupItem>
					<ToggleGroupItem value="horror">Horror</ToggleGroupItem>
					<ToggleGroupItem value="sci-fi">Sci-Fi</ToggleGroupItem>
				</ToggleGroup>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Multiple selection toggle group for filtering by genres",
			},
		},
	},
};

export const Vertical: Story = {
	args: {
		type: "single",
		orientation: "vertical",
		defaultValue: "popular",
	},
	render: args => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="popular">Popular</ToggleGroupItem>
			<ToggleGroupItem value="trending">Trending</ToggleGroupItem>
			<ToggleGroupItem value="latest">Latest</ToggleGroupItem>
			<ToggleGroupItem value="top-rated">Top Rated</ToggleGroupItem>
		</ToggleGroup>
	),
	parameters: {
		docs: {
			description: {
				story: "Vertical orientation toggle group for sorting options",
			},
		},
	},
};

export const Disabled: Story = {
	args: {
		type: "multiple",
		disabled: true,
	},
	render: args => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="bold" aria-label="Bold">
				<Bold className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Italic">
				<Italic className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Underline">
				<Underline className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
	parameters: {
		docs: {
			description: {
				story: "Disabled toggle group state",
			},
		},
	},
};

export const SortingOptions: Story = {
	args: {
		type: "single",
		defaultValue: "date-desc",
	},
	render: args => (
		<div className="space-y-2">
			<label className="text-sm font-medium">Sort by:</label>
			<ToggleGroup {...args}>
				<ToggleGroupItem value="date-desc">Newest First</ToggleGroupItem>
				<ToggleGroupItem value="date-asc">Oldest First</ToggleGroupItem>
				<ToggleGroupItem value="rating">Rating</ToggleGroupItem>
				<ToggleGroupItem value="popularity">Popularity</ToggleGroupItem>
			</ToggleGroup>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Toggle group for sorting media content",
			},
		},
	},
};

export const StreamingQuality: Story = {
	args: {
		type: "single",
		defaultValue: "auto",
	},
	render: args => (
		<div className="space-y-4">
			<div>
				<h3 className="font-medium">Streaming Quality</h3>
				<p className="text-sm text-muted-foreground mb-3">
					Choose the video quality for streaming content
				</p>
				<ToggleGroup {...args} orientation="vertical">
					<ToggleGroupItem value="auto" className="justify-start">
						<div className="text-left">
							<div className="font-medium">Auto</div>
							<div className="text-xs text-muted-foreground">Adjust based on connection</div>
						</div>
					</ToggleGroupItem>
					<ToggleGroupItem value="720p" className="justify-start">
						<div className="text-left">
							<div className="font-medium">720p HD</div>
							<div className="text-xs text-muted-foreground">Good for slower connections</div>
						</div>
					</ToggleGroupItem>
					<ToggleGroupItem value="1080p" className="justify-start">
						<div className="text-left">
							<div className="font-medium">1080p Full HD</div>
							<div className="text-xs text-muted-foreground">Best for most devices</div>
						</div>
					</ToggleGroupItem>
					<ToggleGroupItem value="4k" className="justify-start">
						<div className="text-left">
							<div className="font-medium">4K Ultra HD</div>
							<div className="text-xs text-muted-foreground">Requires fast connection</div>
						</div>
					</ToggleGroupItem>
				</ToggleGroup>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Detailed toggle group for streaming quality settings with descriptions",
			},
		},
	},
};
