import { Avatar, AvatarFallback, AvatarImage } from "@popcorntime/ui/components/avatar";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/Avatar",
	component: Avatar,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"An avatar component for displaying user profile pictures with fallback support.",
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
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Avatar>
			<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
	),
};

export const WithFallback: Story = {
	render: () => (
		<Avatar>
			<AvatarImage src="/broken-image.jpg" alt="@user" />
			<AvatarFallback>JD</AvatarFallback>
		</Avatar>
	),
	parameters: {
		docs: {
			description: {
				story: "Avatar with a broken image URL, showing the fallback initials",
			},
		},
	},
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Avatar className="size-6">
				<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
				<AvatarFallback className="text-xs">CN</AvatarFallback>
			</Avatar>
			<Avatar className="size-8">
				<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
				<AvatarFallback className="text-sm">CN</AvatarFallback>
			</Avatar>
			<Avatar className="size-10">
				<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
			<Avatar className="size-12">
				<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
			<Avatar className="size-16">
				<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
				<AvatarFallback className="text-lg">CN</AvatarFallback>
			</Avatar>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Avatars in different sizes",
			},
		},
	},
};

export const FallbackVariations: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Avatar>
				<AvatarFallback>JD</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarFallback className="bg-primary text-primary-foreground">AB</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarFallback className="bg-destructive text-destructive-foreground">?</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarFallback>
					<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
							clipRule="evenodd"
						/>
					</svg>
				</AvatarFallback>
			</Avatar>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Different fallback styles including colored backgrounds and icons",
			},
		},
	},
};

export const UserList: Story = {
	render: () => {
		const users = [
			{
				name: "John Doe",
				image:
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
				initials: "JD",
			},
			{
				name: "Jane Smith",
				image:
					"https://images.unsplash.com/photo-1494790108755-2616b86b5e0b?w=32&h=32&fit=crop&crop=face",
				initials: "JS",
			},
			{ name: "Alice Johnson", image: "/broken.jpg", initials: "AJ" },
			{
				name: "Bob Wilson",
				image:
					"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
				initials: "BW",
			},
		];

		return (
			<div className="space-y-4">
				{users.map(user => (
					<div key={user.name} className="flex items-center gap-3">
						<Avatar>
							<AvatarImage src={user.image} alt={`@${user.name}`} />
							<AvatarFallback>{user.initials}</AvatarFallback>
						</Avatar>
						<span className="text-sm font-medium">{user.name}</span>
					</div>
				))}
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "Avatar component used in a user list with mixed image loading states",
			},
		},
	},
};

export const AvatarGroup: Story = {
	render: () => (
		<div className="flex -space-x-2">
			<Avatar className="border-2 border-background">
				<AvatarImage
					src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
					alt="User 1"
				/>
				<AvatarFallback>U1</AvatarFallback>
			</Avatar>
			<Avatar className="border-2 border-background">
				<AvatarImage
					src="https://images.unsplash.com/photo-1494790108755-2616b86b5e0b?w=32&h=32&fit=crop&crop=face"
					alt="User 2"
				/>
				<AvatarFallback>U2</AvatarFallback>
			</Avatar>
			<Avatar className="border-2 border-background">
				<AvatarImage
					src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
					alt="User 3"
				/>
				<AvatarFallback>U3</AvatarFallback>
			</Avatar>
			<Avatar className="border-2 border-background">
				<AvatarFallback className="bg-primary text-primary-foreground text-xs">+5</AvatarFallback>
			</Avatar>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Overlapping avatar group showing multiple users with a count indicator",
			},
		},
	},
};
