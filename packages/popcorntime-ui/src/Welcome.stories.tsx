import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Welcome",
  parameters: {
    layout: "centered",
    docs: {
      page: () => (
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">@popcorntime/ui</h1>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              Welcome to the Popcorn Time UI component library documentation.
              This Storybook contains interactive examples and documentation for
              all our reusable UI components.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              📚 What you'll find here
            </h2>
            <ul className="space-y-2 mb-8">
              <li>
                <strong>Component Examples</strong> - Interactive stories
                showing components in different states
              </li>
              <li>
                <strong>Documentation</strong> - Comprehensive guides and prop
                tables
              </li>
              <li>
                <strong>Accessibility Testing</strong> - Built-in a11y checks
                for inclusive design
              </li>
              <li>
                <strong>Design Guidelines</strong> - Best practices and usage
                patterns
              </li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">
              🎨 Component Coverage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="space-y-2">
                <h3 className="font-medium">Form Components</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    Button - Primary, secondary, and specialized actions
                  </li>
                  <li>Input - Text fields with validation states</li>
                  <li>Checkbox - Selection controls</li>
                  <li>Label - Form element labels</li>
                  <li>Toggle - Switch controls</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Display Components</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Avatar - User profile images</li>
                  <li>Badge - Status and category indicators</li>
                  <li>Separator - Visual content dividers</li>
                  <li>Tooltip - Contextual help and information</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Layout Components</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Dialog - Modal and overlay content</li>
                  <li>Tabs - Content organization</li>
                </ul>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">🚀 Getting Started</h2>
            <div className="bg-muted p-4 rounded-lg mb-8">
              <p className="text-sm mb-2">
                To use these components in your project:
              </p>
              <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
                <code>{`import { Button, Input } from '@popcorntime/ui/components/button'
import { Dialog, DialogContent } from '@popcorntime/ui/components/dialog'

function MyComponent() {
  return (
    <div>
      <Button variant="primary">Click me</Button>
      <Input placeholder="Enter text..." />
    </div>
  )
}`}</code>
              </pre>
            </div>

            <h2 className="text-xl font-semibold mb-4">✨ Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">🎛️</div>
                <h3 className="font-medium mb-1">Interactive Controls</h3>
                <p className="text-sm text-muted-foreground">
                  Modify props in real-time
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">♿</div>
                <h3 className="font-medium mb-1">Accessibility</h3>
                <p className="text-sm text-muted-foreground">
                  Built-in a11y testing
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">📱</div>
                <h3 className="font-medium mb-1">Responsive</h3>
                <p className="text-sm text-muted-foreground">
                  Mobile-first design
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Welcome: Story = {
  render: () => (
    <div className="text-center p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to PopcornTime UI</h1>
      <p className="text-muted-foreground mb-6">
        Explore our component library using the sidebar navigation
      </p>
      <div className="flex gap-4 justify-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
          11 Components
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
          Fully Accessible
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
          TypeScript
        </span>
      </div>
    </div>
  ),
};
