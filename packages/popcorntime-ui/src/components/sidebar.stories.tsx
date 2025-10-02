import type { Meta, StoryObj } from "@storybook/react-vite";
import { Film, Home, MoreHorizontal, Search, Settings, Star, Tv } from "lucide-react";
import { fn } from "storybook/test";
import { Badge } from "@popcorntime/ui/components/badge";
import { Button } from "@popcorntime/ui/components/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInput,
	SidebarInset,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarRail,
	SidebarSeparator,
	SidebarTrigger,
	useSidebar,
} from "@popcorntime/ui/components/sidebar";

const meta = {
	title: "Components/Sidebar",
	component: SidebarProvider,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"A sidebar navigation component with collapsible groups, search, and contextual content management.",
			},
		},
	},
	tags: ["autodocs"],
	decorators: [
		Story => (
			<div className="flex h-screen w-full">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof SidebarProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component that demonstrates sidebar usage
function SidebarExample() {
	return (
		<SidebarProvider>
			<Sidebar collapsible="icon">
				<SidebarHeader>
					<div className="flex items-center gap-2 px-4 py-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<Film className="h-4 w-4" />
						</div>
						<span className="font-semibold">PopcornTime</span>
					</div>
				</SidebarHeader>

				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Navigation</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton>
										<Home className="h-4 w-4" />
										<span>Home</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton isActive>
										<Film className="h-4 w-4" />
										<span>Movies</span>
										<SidebarMenuBadge>24</SidebarMenuBadge>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton>
										<Tv className="h-4 w-4" />
										<span>TV Shows</span>
									</SidebarMenuButton>
									<SidebarMenuSub>
										<SidebarMenuSubItem>
											<SidebarMenuSubButton>Popular</SidebarMenuSubButton>
										</SidebarMenuSubItem>
										<SidebarMenuSubItem>
											<SidebarMenuSubButton>Trending</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									</SidebarMenuSub>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton>
										<Star className="h-4 w-4" />
										<span>Favorites</span>
									</SidebarMenuButton>
									<SidebarMenuAction>
										<MoreHorizontal className="h-4 w-4" />
									</SidebarMenuAction>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>

					<SidebarSeparator />

					<SidebarGroup>
						<SidebarGroupLabel>Filters</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarInput placeholder="Search..." />
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton>
								<Settings className="h-4 w-4" />
								<span>Settings</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>

				<SidebarRail />
			</Sidebar>

			<SidebarInset>
				<div className="flex flex-col gap-4 p-6">
					<div className="flex items-center gap-2">
						<SidebarTrigger />
						<h1 className="text-xl font-semibold">Main Content</h1>
					</div>
					<div className="min-h-[400px] rounded-lg border bg-muted/50 p-6">
						<p className="text-muted-foreground">
							Main content area. The sidebar can be collapsed using the trigger button.
						</p>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

export const Default: Story = {
	render: () => <SidebarExample />,
};

export const CollapsibleIcon: Story = {
	render: () => (
		<SidebarProvider>
			<Sidebar collapsible="icon">
				<SidebarHeader>
					<div className="px-3 py-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<Film className="h-4 w-4" />
						</div>
					</div>
				</SidebarHeader>

				<SidebarContent>
					<SidebarGroup>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton tooltip="Home">
									<Home className="h-4 w-4" />
									<span>Home</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton tooltip="Movies" isActive>
									<Film className="h-4 w-4" />
									<span>Movies</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton tooltip="TV Shows">
									<Tv className="h-4 w-4" />
									<span>TV Shows</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>

				<SidebarRail />
			</Sidebar>

			<SidebarInset>
				<div className="p-6">
					<div className="flex items-center gap-2 mb-4">
						<SidebarTrigger />
						<h2 className="text-lg font-semibold">Icon Collapsible Sidebar</h2>
					</div>
					<p className="text-muted-foreground">
						This sidebar collapses to show only icons with tooltips on hover.
					</p>
				</div>
			</SidebarInset>
		</SidebarProvider>
	),
	parameters: {
		docs: {
			description: {
				story: "Sidebar that collapses to icon-only mode with tooltips",
			},
		},
	},
};

export const WithSearch: Story = {
	render: () => (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader>
					<SidebarInput placeholder="Search content..." />
				</SidebarHeader>

				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Browse</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton>
										<Film className="h-4 w-4" />
										<span>Action Movies</span>
										<SidebarMenuBadge>142</SidebarMenuBadge>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton>
										<Film className="h-4 w-4" />
										<span>Comedy Movies</span>
										<SidebarMenuBadge>87</SidebarMenuBadge>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton>
										<Tv className="h-4 w-4" />
										<span>Drama Series</span>
										<SidebarMenuBadge>23</SidebarMenuBadge>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				<SidebarRail />
			</Sidebar>

			<SidebarInset>
				<div className="p-6">
					<div className="flex items-center gap-2 mb-4">
						<SidebarTrigger />
						<h2 className="text-lg font-semibold">Sidebar with Search</h2>
					</div>
					<p className="text-muted-foreground">
						Sidebar with search functionality and category badges.
					</p>
				</div>
			</SidebarInset>
		</SidebarProvider>
	),
	parameters: {
		docs: {
			description: {
				story: "Sidebar with integrated search and category counts",
			},
		},
	},
};

export const NestedMenus: Story = {
	render: () => (
		<SidebarProvider>
			<Sidebar>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Media Library</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton>
										<Film className="h-4 w-4" />
										<span>Movies</span>
									</SidebarMenuButton>
									<SidebarMenuSub>
										<SidebarMenuSubItem>
											<SidebarMenuSubButton isActive>Recently Added</SidebarMenuSubButton>
										</SidebarMenuSubItem>
										<SidebarMenuSubItem>
											<SidebarMenuSubButton>Popular</SidebarMenuSubButton>
										</SidebarMenuSubItem>
										<SidebarMenuSubItem>
											<SidebarMenuSubButton>Top Rated</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									</SidebarMenuSub>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton>
										<Tv className="h-4 w-4" />
										<span>TV Shows</span>
									</SidebarMenuButton>
									<SidebarMenuSub>
										<SidebarMenuSubItem>
											<SidebarMenuSubButton>Airing Today</SidebarMenuSubButton>
										</SidebarMenuSubItem>
										<SidebarMenuSubItem>
											<SidebarMenuSubButton>On the Air</SidebarMenuSubButton>
										</SidebarMenuSubItem>
										<SidebarMenuSubItem>
											<SidebarMenuSubButton>Popular</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									</SidebarMenuSub>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				<SidebarRail />
			</Sidebar>

			<SidebarInset>
				<div className="p-6">
					<div className="flex items-center gap-2 mb-4">
						<SidebarTrigger />
						<h2 className="text-lg font-semibold">Nested Menus</h2>
					</div>
					<p className="text-muted-foreground">Hierarchical navigation with expandable submenus.</p>
				</div>
			</SidebarInset>
		</SidebarProvider>
	),
	parameters: {
		docs: {
			description: {
				story: "Sidebar with nested submenus for hierarchical navigation",
			},
		},
	},
};

// Standalone components for testing
export const SidebarComponents: Story = {
	render: () => (
		<SidebarProvider>
			<div className="space-y-4 p-6 max-w-sm">
				<div>
					<h3 className="font-medium mb-2">Sidebar Input</h3>
					<SidebarInput placeholder="Search movies..." />
				</div>

				<div>
					<h3 className="font-medium mb-2">Menu Items</h3>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton>
								<Home className="h-4 w-4" />
								<span>Home</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton isActive>
								<Film className="h-4 w-4" />
								<span>Movies</span>
								<SidebarMenuBadge>24</SidebarMenuBadge>
							</SidebarMenuButton>
							<SidebarMenuAction>
								<MoreHorizontal className="h-4 w-4" />
							</SidebarMenuAction>
						</SidebarMenuItem>
					</SidebarMenu>
				</div>

				<div>
					<h3 className="font-medium mb-2">Group Labels</h3>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarSeparator className="my-2" />
					<SidebarGroupLabel>Content</SidebarGroupLabel>
				</div>
			</div>
		</SidebarProvider>
	),
	parameters: {
		layout: "centered",
		docs: {
			description: {
				story: "Individual sidebar components for testing and customization",
			},
		},
	},
};
