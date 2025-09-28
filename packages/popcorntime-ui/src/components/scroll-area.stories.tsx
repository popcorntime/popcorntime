import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea, ScrollBar } from "@popcorntime/ui/components/scroll-area";
import { Separator } from "@popcorntime/ui/components/separator";

const meta = {
	title: "Components/ScrollArea",
	component: ScrollArea,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "A custom scrollable area with styled scrollbars that can be hidden or shown.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ScrollArea className="h-72 w-48 rounded-md border">
			<div className="p-4">
				<h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
				{Array.from({ length: 50 }).map((_, i) => (
					<div key={i}>
						<div className="text-sm">v1.2.0-beta.{i + 1}</div>
						<Separator className="my-2" />
					</div>
				))}
			</div>
		</ScrollArea>
	),
};

export const MovieList: Story = {
	render: () => {
		const movies = [
			{ title: "The Shawshank Redemption", year: 1994, genre: "Drama", rating: 9.3 },
			{ title: "The Godfather", year: 1972, genre: "Crime", rating: 9.2 },
			{ title: "The Dark Knight", year: 2008, genre: "Action", rating: 9.0 },
			{ title: "The Godfather Part II", year: 1974, genre: "Crime", rating: 9.0 },
			{ title: "Angry Men", year: 1957, genre: "Drama", rating: 9.0 },
			{ title: "Schindler's List", year: 1993, genre: "Drama", rating: 8.9 },
			{
				title: "The Lord of the Rings: The Return of the King",
				year: 2003,
				genre: "Fantasy",
				rating: 8.9,
			},
			{ title: "Pulp Fiction", year: 1994, genre: "Crime", rating: 8.8 },
			{
				title: "The Lord of the Rings: The Fellowship of the Ring",
				year: 2001,
				genre: "Fantasy",
				rating: 8.8,
			},
			{ title: "The Good, the Bad and the Ugly", year: 1966, genre: "Western", rating: 8.8 },
			{ title: "Forrest Gump", year: 1994, genre: "Drama", rating: 8.8 },
			{ title: "The Lord of the Rings: The Two Towers", year: 2002, genre: "Fantasy", rating: 8.7 },
			{ title: "Fight Club", year: 1999, genre: "Drama", rating: 8.7 },
			{ title: "Inception", year: 2010, genre: "Sci-Fi", rating: 8.7 },
			{ title: "The Matrix", year: 1999, genre: "Sci-Fi", rating: 8.7 },
			{ title: "Goodfellas", year: 1990, genre: "Crime", rating: 8.7 },
			{ title: "Seven Samurai", year: 1954, genre: "Action", rating: 8.6 },
			{ title: "Star Wars: Episode IV - A New Hope", year: 1977, genre: "Sci-Fi", rating: 8.6 },
			{ title: "City of God", year: 2002, genre: "Crime", rating: 8.6 },
			{ title: "Casablanca", year: 1942, genre: "Romance", rating: 8.5 },
		];

		return (
			<ScrollArea className="h-96 w-full max-w-md rounded-md border">
				<div className="p-4">
					<h4 className="mb-4 text-sm font-medium leading-none">Top Movies</h4>
					{movies.map((movie, i) => (
						<div key={i}>
							<div className="py-2">
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<div className="font-medium text-sm">{movie.title}</div>
										<div className="text-xs text-muted-foreground">
											{movie.year} • {movie.genre}
										</div>
									</div>
									<div className="text-xs font-medium">⭐ {movie.rating}</div>
								</div>
							</div>
							{i < movies.length - 1 && <Separator />}
						</div>
					))}
				</div>
			</ScrollArea>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "Scrollable movie list with movie information",
			},
		},
	},
};

export const HorizontalScroll: Story = {
	render: () => {
		const genres = [
			"Action",
			"Adventure",
			"Animation",
			"Comedy",
			"Crime",
			"Documentary",
			"Drama",
			"Family",
			"Fantasy",
			"History",
			"Horror",
			"Music",
			"Mystery",
			"Romance",
			"Science Fiction",
			"TV Movie",
			"Thriller",
			"War",
			"Western",
		];

		return (
			<ScrollArea className="w-96 whitespace-nowrap rounded-md border">
				<div className="flex w-max space-x-4 p-4">
					{genres.map(genre => (
						<div key={genre} className="shrink-0 rounded-md border px-3 py-2 text-sm">
							{genre}
						</div>
					))}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "Horizontal scrolling area for genre tags with visible scrollbar",
			},
		},
	},
};

export const ThumbnailGrid: Story = {
	render: () => (
		<ScrollArea className="h-72 w-80 rounded-md border">
			<div className="p-4">
				<h4 className="mb-4 text-sm font-medium leading-none">Movie Posters</h4>
				<div className="grid grid-cols-3 gap-2">
					{Array.from({ length: 24 }).map((_, i) => (
						<div
							key={i}
							className="aspect-[2/3] bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground"
						>
							Movie {i + 1}
						</div>
					))}
				</div>
			</div>
		</ScrollArea>
	),
	parameters: {
		docs: {
			description: {
				story: "Scrollable grid of movie poster thumbnails",
			},
		},
	},
};

export const WatchHistory: Story = {
	render: () => {
		const watchHistory = Array.from({ length: 20 }).map((_, i) => ({
			title: `Movie ${i + 1}`,
			watchedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
			progress: Math.floor(Math.random() * 100),
		}));

		return (
			<ScrollArea className="h-80 w-72 rounded-md border">
				<div className="p-4">
					<h4 className="mb-4 text-sm font-medium leading-none">Watch History</h4>
					<div className="space-y-3">
						{watchHistory.map((item, i) => (
							<div key={i} className="space-y-1">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">{item.title}</span>
									<span className="text-xs text-muted-foreground">{item.watchedAt}</span>
								</div>
								<div className="w-full bg-muted rounded-full h-1.5">
									<div
										className="bg-primary h-1.5 rounded-full"
										style={{ width: `${item.progress}%` }}
									/>
								</div>
								<div className="text-xs text-muted-foreground">{item.progress}% watched</div>
							</div>
						))}
					</div>
				</div>
			</ScrollArea>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "Watch history with progress bars in a scrollable area",
			},
		},
	},
};

export const ChatMessages: Story = {
	render: () => {
		const messages = Array.from({ length: 15 }).map((_, i) => ({
			user: ["Alice", "Bob", "Charlie", "Diana"][i % 4],
			message: `This is message ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
			time: `${9 + Math.floor(i / 3)}:${(i * 7) % 60}`,
		}));

		return (
			<div className="border rounded-lg">
				<div className="p-3 border-b">
					<h4 className="text-sm font-medium">Live Chat</h4>
				</div>
				<ScrollArea className="h-64">
					<div className="p-3 space-y-3">
						{messages.map((msg, i) => (
							<div key={i} className="text-sm">
								<div className="flex items-baseline gap-2">
									<span className="font-medium text-primary">{msg.user}</span>
									<span className="text-xs text-muted-foreground">{msg.time}</span>
								</div>
								<div className="text-muted-foreground mt-1">{msg.message}</div>
							</div>
						))}
					</div>
				</ScrollArea>
				<div className="p-3 border-t">
					<div className="flex gap-2">
						<input
							className="flex-1 px-3 py-1 text-sm border rounded"
							placeholder="Type a message..."
						/>
						<button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded">
							Send
						</button>
					</div>
				</div>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "Chat interface with scrollable message history",
			},
		},
	},
};

export const FileExplorer: Story = {
	render: () => {
		const files = [
			{ name: "Movies", type: "folder", size: "", modified: "2024-01-15" },
			{ name: "TV Shows", type: "folder", size: "", modified: "2024-01-14" },
			{ name: "Downloads", type: "folder", size: "", modified: "2024-01-13" },
			{ name: "Inception.mkv", type: "video", size: "2.8 GB", modified: "2024-01-12" },
			{ name: "The Matrix.mp4", type: "video", size: "1.9 GB", modified: "2024-01-11" },
			{ name: "Interstellar.mkv", type: "video", size: "3.2 GB", modified: "2024-01-10" },
			{ name: "The Dark Knight.mp4", type: "video", size: "2.1 GB", modified: "2024-01-09" },
			{ name: "Pulp Fiction.mkv", type: "video", size: "2.5 GB", modified: "2024-01-08" },
			{ name: "Fight Club.mp4", type: "video", size: "1.8 GB", modified: "2024-01-07" },
			{ name: "Goodfellas.mkv", type: "video", size: "2.3 GB", modified: "2024-01-06" },
			{ name: "The Godfather.mp4", type: "video", size: "2.0 GB", modified: "2024-01-05" },
			{ name: "Casablanca.mkv", type: "video", size: "1.2 GB", modified: "2024-01-04" },
		];

		return (
			<ScrollArea className="h-80 w-96 rounded-md border">
				<div className="p-4">
					<h4 className="mb-4 text-sm font-medium leading-none">Media Library</h4>
					<div className="space-y-1">
						{files.map((file, i) => (
							<div
								key={i}
								className="flex items-center justify-between p-2 hover:bg-muted rounded text-sm"
							>
								<div className="flex items-center gap-2">
									<div className="w-4 text-center">{file.type === "folder" ? "📁" : "🎬"}</div>
									<span className={file.type === "folder" ? "font-medium" : ""}>{file.name}</span>
								</div>
								<div className="flex gap-4 text-xs text-muted-foreground">
									{file.size && <span>{file.size}</span>}
									<span>{file.modified}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</ScrollArea>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "File explorer interface showing media library with folders and videos",
			},
		},
	},
};

export const BothScrollbars: Story = {
	render: () => (
		<ScrollArea className="h-72 w-80 rounded-md border">
			<div className="p-4" style={{ width: "600px", height: "500px" }}>
				<h4 className="mb-4 text-sm font-medium leading-none">Large Content Area</h4>
				<div className="space-y-4">
					{Array.from({ length: 20 }).map((_, i) => (
						<div key={i} className="p-4 border rounded-lg">
							<h5 className="font-medium">Section {i + 1}</h5>
							<p className="text-sm text-muted-foreground mt-2">
								This is a very long piece of content that extends beyond the normal width of the
								container. It demonstrates how the horizontal scrollbar works alongside the vertical
								one. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
								incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
								exercitation ullamco.
							</p>
						</div>
					))}
				</div>
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	),
	parameters: {
		docs: {
			description: {
				story: "Content that requires both horizontal and vertical scrolling",
			},
		},
	},
};
