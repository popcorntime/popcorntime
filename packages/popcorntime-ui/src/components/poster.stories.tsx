import type { Meta, StoryObj } from '@storybook/react'
import { MediaPosterAsPicture, Poster, PosterSkeleton } from './poster'

const meta = {
  title: 'Components/Poster',
  component: Poster,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Media poster component for displaying movie and TV show poster images with proper fallback handling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isAboveTheFold: {
      control: 'boolean',
      description: 'Whether the poster is above the fold for lazy loading optimization',
    },
    withFreeBadge: {
      control: 'boolean',
      description: 'Whether to show a "Free" badge on the poster',
    },
  },
} satisfies Meta<typeof Poster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    media: {
      poster: '/12345.jpg',
      title: 'The Matrix',
      overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    },
    translations: {
      free: 'Free',
      kind: 'Movie',
    },
    isAboveTheFold: true,
  },
  render: (args) => (
    <div className="w-48">
      <Poster {...args} />
    </div>
  ),
}

export const WithFreeBadge: Story = {
  args: {
    media: {
      poster: '/67890.jpg',
      title: 'Inception',
      overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    },
    translations: {
      free: 'Free',
      kind: 'Movie',
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
}

export const NoPoster: Story = {
  args: {
    media: {
      title: 'Unknown Movie',
      overview: 'This movie has no poster available, showing the fallback behavior.',
    },
    translations: {
      free: 'Free',
      kind: 'Movie',
    },
    placeholder: 'https://via.placeholder.com/300x450/374151/f3f4f6?text=No+Poster',
  },
  render: (args) => (
    <div className="w-48">
      <Poster {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Poster without image showing placeholder',
      },
    },
  },
}

export const TVShow: Story = {
  args: {
    media: {
      poster: '/tv123.jpg',
      title: 'Stranger Things',
      overview: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.',
    },
    translations: {
      free: 'Free',
      kind: 'TV Show',
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
        story: 'TV show poster with different kind translation',
      },
    },
  },
}

export const MovieGrid: Story = {
  render: () => {
    const movies = [
      { 
        poster: '/movie1.jpg',
        title: 'The Dark Knight', 
        overview: 'Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and DA Harvey Dent.',
      },
      { 
        poster: '/movie2.jpg',
        title: 'Pulp Fiction', 
        overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence.',
      },
      { 
        poster: '/movie3.jpg',
        title: 'Fight Club', 
        overview: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club.',
      },
      { 
        poster: '/movie4.jpg',
        title: 'Goodfellas', 
        overview: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife.',
      },
    ];

    const translations = {
      free: 'Free',
      kind: 'Movie',
    };

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie, i) => (
          <div key={i} className="space-y-2">
            <Poster 
              media={movie}
              translations={translations}
              withFreeBadge={i % 2 === 0}
              isAboveTheFold={i < 2}
            />
            <div className="text-center">
              <h3 className="font-medium text-sm line-clamp-2">{movie.title}</h3>
            </div>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Grid of movie posters with hover effects and free badges',
      },
    },
  },
}

export const LoadingSkeletons: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <PosterSkeleton />
          <div className="space-y-1">
            <div className="h-4 bg-muted animate-pulse rounded w-3/4 mx-auto" />
            <div className="h-3 bg-muted animate-pulse rounded w-1/2 mx-auto" />
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading skeleton states while posters are being fetched',
      },
    },
  },
}

export const MixedContent: Story = {
  render: () => {
    const content = [
      { 
        poster: '/action1.jpg',
        title: 'Mad Max: Fury Road', 
        overview: 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler.',
        type: 'Movie',
        free: true
      },
      { 
        title: 'Loading Movie', 
        overview: 'This movie is still loading...',
        type: 'Movie',
        free: false,
        loading: true
      },
      { 
        poster: '/series1.jpg',
        title: 'Breaking Bad', 
        overview: 'A high school chemistry teacher turned methamphetamine manufacturer.',
        type: 'TV Show',
        free: true
      },
      { 
        title: 'No Poster Available', 
        overview: 'This content has no poster image available.',
        type: 'Movie',
        free: false
      },
    ];

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Mixed Content</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {content.map((item, i) => (
            <div key={i} className="space-y-3">
              {item.loading ? (
                <PosterSkeleton />
              ) : (
                <Poster 
                  media={{
                    poster: item.poster,
                    title: item.title,
                    overview: item.overview
                  }}
                  translations={{
                    free: 'Free',
                    kind: item.type,
                  }}
                  withFreeBadge={item.free}
                  placeholder="https://via.placeholder.com/300x450/374151/f3f4f6?text=No+Image"
                />
              )}
              <div className="text-center">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Mixed content showing movies, TV shows, loading states, and missing posters',
      },
    },
  },
}

export const ResponsiveGrid: Story = {
  render: () => {
    const popularContent = Array.from({ length: 20 }).map((_, i) => ({
      poster: `/popular${i + 1}.jpg`,
      title: `Popular Title ${i + 1}`,
      overview: `This is the overview for popular content item ${i + 1}. It contains interesting information about the plot.`,
      type: i % 3 === 0 ? 'TV Show' : 'Movie',
      free: i % 4 === 0,
    }));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Popular Content</h2>
          <button className="text-sm text-primary hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
          {popularContent.map((item, i) => (
            <div key={i} className="space-y-2">
              <Poster 
                media={{
                  poster: item.poster,
                  title: item.title,
                  overview: item.overview
                }}
                translations={{
                  free: 'Free',
                  kind: item.type,
                }}
                withFreeBadge={item.free}
                isAboveTheFold={i < 8}
                placeholder="https://via.placeholder.com/300x450/374151/f3f4f6?text=Poster"
              />
              <div className="text-center space-y-1">
                <h3 className="font-medium text-xs leading-tight line-clamp-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Responsive grid that adapts from 2 columns on mobile to 8 columns on large screens',
      },
    },
  },
}

export const DirectPicture: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="font-medium">Direct Picture Component</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <MediaPosterAsPicture 
            posterId="12345"
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
            placeholder="https://via.placeholder.com/300x450/374151/f3f4f6?text=Fallback"
            className="w-full aspect-[2/3] rounded-lg"
          />
          <p className="text-sm text-center">Fallback Image</p>
        </div>

        <div className="space-y-2">
          <MediaPosterAsPicture 
            posterId="67890"
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
        story: 'Direct usage of MediaPosterAsPicture component with different configurations',
      },
    },
  },
}