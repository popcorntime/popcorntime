import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarFallback } from "@popcorntime/ui/components/avatar";
import { Skeleton } from "@popcorntime/ui/components/skeleton";

const meta = {
	title: "Components/Skeleton",
	component: Skeleton,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Loading skeleton component to show placeholder content while data is being fetched.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		className: {
			control: "text",
			description: "Additional CSS classes",
		},
	},
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="space-y-2">
			<Skeleton className="h-4 w-64" />
			<Skeleton className="h-4 w-48" />
			<Skeleton className="h-4 w-56" />
		</div>
	),
};

export const Shapes: Story = {
	render: () => (
		<div className="space-y-4">
			<div>
				<h3 className="font-medium mb-2">Rectangle</h3>
				<Skeleton className="h-8 w-32" />
			</div>

			<div>
				<h3 className="font-medium mb-2">Circle</h3>
				<Skeleton className="h-12 w-12 rounded-full" />
			</div>

			<div>
				<h3 className="font-medium mb-2">Rounded Rectangle</h3>
				<Skeleton className="h-10 w-40 rounded-lg" />
			</div>

			<div>
				<h3 className="font-medium mb-2">Text Lines</h3>
				<div className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
					<Skeleton className="h-4 w-4/6" />
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Different skeleton shapes and sizes",
			},
		},
	},
};

export const MovieCard: Story = {
	render: () => (
		<div className="w-64 p-4 border rounded-lg">
			<div className="space-y-4">
				{/* Movie poster */}
				<Skeleton className="h-96 w-full rounded-lg" />

				{/* Title */}
				<div className="space-y-2">
					<Skeleton className="h-6 w-3/4" />
					<Skeleton className="h-4 w-1/2" />
				</div>

				{/* Rating and year */}
				<div className="flex items-center gap-4">
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-4 w-12" />
				</div>

				{/* Description */}
				<div className="space-y-2">
					<Skeleton className="h-3 w-full" />
					<Skeleton className="h-3 w-5/6" />
					<Skeleton className="h-3 w-4/6" />
				</div>

				{/* Actions */}
				<div className="flex gap-2">
					<Skeleton className="h-9 w-20" />
					<Skeleton className="h-9 w-9" />
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Movie card skeleton matching PopcornTime design patterns",
			},
		},
	},
};

export const UserProfile: Story = {
	render: () => (
		<div className="flex items-center space-x-4 p-4 border rounded-lg w-80">
			<Skeleton className="h-12 w-12 rounded-full" />
			<div className="space-y-2 flex-1">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-3 w-24" />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "User profile skeleton with avatar and text",
			},
		},
	},
};

export const MediaList: Story = {
	render: () => (
		<div className="space-y-4 w-full max-w-2xl">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
					{/* Thumbnail */}
					<Skeleton className="h-16 w-28 rounded" />

					<div className="flex-1 space-y-2">
						{/* Title */}
						<Skeleton className="h-5 w-48" />

						{/* Metadata */}
						<div className="flex items-center gap-4">
							<Skeleton className="h-3 w-16" />
							<Skeleton className="h-3 w-12" />
							<Skeleton className="h-3 w-20" />
						</div>

						{/* Description */}
						<Skeleton className="h-3 w-full" />
					</div>

					{/* Action button */}
					<Skeleton className="h-8 w-8 rounded" />
				</div>
			))}
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Media list skeleton for search results or watchlist",
			},
		},
	},
};

export const Navigation: Story = {
	render: () => (
		<div className="w-64 p-4 border rounded-lg">
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center gap-3">
					<Skeleton className="h-8 w-8 rounded-lg" />
					<Skeleton className="h-6 w-24" />
				</div>

				{/* Menu items */}
				<div className="space-y-3">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="flex items-center gap-3">
							<Skeleton className="h-4 w-4" />
							<Skeleton className="h-4 w-20" />
							{i === 1 && <Skeleton className="h-4 w-6 ml-auto rounded-full" />}
						</div>
					))}
				</div>

				{/* Separator */}
				<Skeleton className="h-px w-full" />

				{/* More menu items */}
				<div className="space-y-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex items-center gap-3">
							<Skeleton className="h-4 w-4" />
							<Skeleton className="h-4 w-16" />
						</div>
					))}
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Navigation sidebar skeleton",
			},
		},
	},
};

export const Table: Story = {
	render: () => (
		<div className="w-full max-w-4xl">
			<div className="rounded-lg border">
				{/* Table header */}
				<div className="flex items-center justify-between p-4 border-b">
					<Skeleton className="h-5 w-32" />
					<div className="flex gap-2">
						<Skeleton className="h-8 w-20" />
						<Skeleton className="h-8 w-8" />
					</div>
				</div>

				{/* Table rows */}
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="flex items-center justify-between p-4 border-b last:border-b-0">
						<div className="flex items-center gap-3">
							<Skeleton className="h-10 w-10 rounded" />
							<div className="space-y-1">
								<Skeleton className="h-4 w-40" />
								<Skeleton className="h-3 w-24" />
							</div>
						</div>

						<div className="flex items-center gap-4">
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-4 w-12" />
							<Skeleton className="h-8 w-8 rounded" />
						</div>
					</div>
				))}
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Table skeleton with headers and rows",
			},
		},
	},
};

export const CardGrid: Story = {
	render: () => (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={i} className="border rounded-lg p-4 space-y-3">
					<Skeleton className="h-48 w-full rounded" />
					<div className="space-y-2">
						<Skeleton className="h-5 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
					</div>
					<div className="flex justify-between items-center">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-8 w-8 rounded-full" />
					</div>
				</div>
			))}
		</div>
	),
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				story: "Grid of media cards skeleton for browse pages",
			},
		},
	},
};

export const SearchResults: Story = {
	render: () => (
		<div className="space-y-4 max-w-2xl">
			{/* Search bar */}
			<div className="flex gap-2 mb-6">
				<Skeleton className="h-10 flex-1 rounded-lg" />
				<Skeleton className="h-10 w-20 rounded-lg" />
			</div>

			{/* Results count */}
			<Skeleton className="h-4 w-40" />

			{/* Results */}
			{Array.from({ length: 8 }).map((_, i) => (
				<div key={i} className="flex gap-4 p-3 border rounded-lg">
					<Skeleton className="h-20 w-14 rounded" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-5 w-56" />
						<div className="flex gap-4">
							<Skeleton className="h-3 w-12" />
							<Skeleton className="h-3 w-16" />
							<Skeleton className="h-3 w-8" />
						</div>
						<Skeleton className="h-3 w-full" />
						<Skeleton className="h-3 w-4/5" />
					</div>
				</div>
			))}
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Search results page skeleton",
			},
		},
	},
};
