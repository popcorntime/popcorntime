import type { Meta, StoryObj } from '@storybook/react'
import { fn, userEvent, within, expect } from '@storybook/test'
import { Button } from './button'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants and sizes, built with Radix UI slot for composition.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'accent', 'ghost', 'link'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'xl', 'xxl', 'icon', 'iconXl', 'icon3Xl'],
      description: 'The size variant of the button',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as a child element (uses Radix UI Slot)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
  args: {
    onClick: fn(),
    children: 'Button',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Default Button',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step("should render button with correct text", async () => {
      const button = await canvas.findByRole("button", { name: /default button/i });
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    await step("should be clickable", async () => {
      const button = await canvas.findByRole("button", { name: /default button/i });
      await userEvent.click(button);
    });
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button variants',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step("should render all button variants", async () => {
      const buttons = await canvas.findAllByRole("button");
      expect(buttons).toHaveLength(7);
      
      // Check each variant exists
      expect(await canvas.findByRole("button", { name: /^default$/i })).toBeInTheDocument();
      expect(await canvas.findByRole("button", { name: /destructive/i })).toBeInTheDocument();
      expect(await canvas.findByRole("button", { name: /outline/i })).toBeInTheDocument();
      expect(await canvas.findByRole("button", { name: /secondary/i })).toBeInTheDocument();
      expect(await canvas.findByRole("button", { name: /accent/i })).toBeInTheDocument();
      expect(await canvas.findByRole("button", { name: /ghost/i })).toBeInTheDocument();
      expect(await canvas.findByRole("button", { name: /link/i })).toBeInTheDocument();
    });

    await step("should be able to click each variant", async () => {
      const buttons = await canvas.findAllByRole("button");
      for (const button of buttons) {
        await userEvent.click(button);
        expect(button).toBeEnabled();
      }
    });
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
      <Button size="xxl">XXL</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different button sizes',
      },
    },
  },
}

export const IconSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button size="icon">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Button>
      <Button size="iconXl">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Button>
      <Button size="icon3Xl">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icon button sizes with SVG icons',
      },
    },
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button disabled>Disabled Default</Button>
      <Button variant="outline" disabled>Disabled Outline</Button>
      <Button variant="destructive" disabled>Disabled Destructive</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled state for different variants',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step("should render disabled buttons", async () => {
      const buttons = await canvas.findAllByRole("button");
      expect(buttons).toHaveLength(3);
      
      // All buttons should be disabled
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    await step("disabled buttons should not be clickable", async () => {
      const disabledButton = await canvas.findByRole("button", { name: /disabled default/i });
      expect(disabledButton).toBeDisabled();
      // Clicking disabled button should not throw error
      await userEvent.click(disabledButton);
    });
  },
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Item
      </Button>
      <Button variant="outline">
        Download
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons with icons using proper spacing',
      },
    },
  },
}