import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  MediaPosterAsPicture,
  Poster,
  PosterSkeleton,
} from "@popcorntime/ui/components/poster";

const meta = {
  title: "Components/Poster",
  component: Poster,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Media poster component for displaying movie and TV show poster images with proper fallback handling.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isAboveTheFold: {
      control: "boolean",
      description:
        "Whether the poster is above the fold for lazy loading optimization",
    },
    withFreeBadge: {
      control: "boolean",
      description: 'Whether to show a "Free" badge on the poster',
    },
  },
} satisfies Meta<typeof Poster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    media: {
      poster: "/o/gcWBYozxHjVf2oBjmddg.jpg",
      title: "The Matrix",
      overview:
        "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    },
    translations: {
      free: "Free",
      kind: "Movie",
    },
    isAboveTheFold: true,
  },
  render: (args) => (
    <div className="w-48">
      <Poster {...args} />
    </div>
  ),
};

export const WithFreeBadge: Story = {
  args: {
    media: {
      poster: "/o/gcWBYozxHjVf2oBjmddg.jpg",
      title: "Inception",
      overview:
        "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    },
    translations: {
      free: "Free",
      kind: "Movie",
    },
    withFreeBadge: true,
    isAboveTheFold: true,
  },
  render: (args) => (
    <div className="w-48">
      <Poster {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Poster with a "Free" ribbon badge',
      },
    },
  },
};

export const NoPoster: Story = {
  args: {
    media: {
      title: "Unknown Movie",
      overview:
        "This movie has no poster available, showing the fallback behavior.",
    },
    translations: {
      free: "Free",
      kind: "Movie",
    },
    placeholder: "https://placehold.co/300x450/374151/f3f4f6?text=No+Poster",
  },
  render: (args) => (
    <div className="w-48">
      <Poster {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Poster without image showing placeholder",
      },
    },
  },
};

export const TVShow: Story = {
  args: {
    media: {
      poster: "/o/LSelmJnbp3xCb8RZDe4d.jpg",
      title: "Stranger Things",
      overview:
        "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    },
    translations: {
      free: "Free",
      kind: "TV Show",
    },
    withFreeBadge: true,
  },
  render: (args) => (
    <div className="w-48">
      <Poster {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "TV show poster with different kind translation",
      },
    },
  },
};

export const MovieGrid: Story = {
  args: {
    media: {
      poster: "/o/gcWBYozxHjVf2oBjmddg.jpg",
      title: "The Dark Knight",
      overview:
        "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and DA Harvey Dent.",
    },
    translations: {
      free: "Free",
      kind: "Movie",
    },
    isAboveTheFold: true,
    withFreeBadge: true,
  },
  render: (args) => {
    const movies = [
      {
        poster: "/o/gcWBYozxHjVf2oBjmddg.jpg",
        title: "The Dark Knight",
        overview:
          "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and DA Harvey Dent.",
      },
      {
        poster: "/o/Gym3XOrLUrUbGxT29L33.jpg",
        title: "Pulp Fiction",
        overview:
          "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence.",
      },
      {
        poster: "/o/LSelmJnbp3xCb8RZDe4d.jpg",
        title: "Fight Club",
        overview:
          "An insomniac office worker and a devil-may-care soap maker form an underground fight club.",
      },
      {
        poster: "/o/TFKZLN5U1OpxkMvOcVsU.jpg",
        title: "Goodfellas",
        overview:
          "The story of Henry Hill and his life in the mob, covering his relationship with his wife.",
      },
    ];

    const translations = {
      free: "Free",
      kind: "Movie",
    };

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie, i) => (
          <div key={i} className="space-y-2">
            <Poster
              {...args}
              media={movie}
              translations={translations}
              withFreeBadge={i % 2 === 0}
              isAboveTheFold={i < 2}
            />
            <div className="text-center">
              <h3 className="font-medium text-sm line-clamp-2">
                {movie.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Grid of movie posters with hover effects and free badges",
      },
    },
  },
};

export const DirectPicture: Story = {
  args: {
    media: {
      poster: "",
      title: "",
      overview: "",
    },
    translations: {
      free: "Free",
      kind: "Movie",
    },
  },
  render: () => (
    <div className="space-y-4">
      <h3 className="font-medium">Direct Picture Component</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <MediaPosterAsPicture
            posterId="gcWBYozxHjVf2oBjmddg"
            title="Movie with Poster ID"
            loading="eager"
            className="w-full aspect-[2/3] rounded-lg"
          />
          <p className="text-sm text-center">With Poster ID</p>
        </div>

        <div className="space-y-2">
          <MediaPosterAsPicture
            title="Movie without Poster ID"
            loading="lazy"
            placeholder="https://placehold.co/300x450/374151/f3f4f6?text=Fallback"
            className="w-full aspect-[2/3] rounded-lg"
          />
          <p className="text-sm text-center">Fallback Image</p>
        </div>

        <div className="space-y-2">
          <MediaPosterAsPicture
            posterId="Gym3XOrLUrUbGxT29L33"
            title="Lazy Loaded Movie"
            loading="lazy"
            className="w-full aspect-[2/3] rounded-lg"
          />
          <p className="text-sm text-center">Lazy Loaded</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Direct usage of MediaPosterAsPicture component with different configurations",
      },
    },
  },
};
