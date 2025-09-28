# Storybook Documentation

This project uses [Storybook](https://storybook.js.org/) to document, develop, and test the UI components in `@popcorntime/ui`.

## Getting Started

### Local Development

To run Storybook locally:

```bash
# From the project root
pnpm --filter @popcorntime/ui storybook

# Or from the UI package directory
cd packages/popcorntime-ui
pnpm storybook
```

This will start Storybook on `http://localhost:6006`.

### Building for Production

To build a static version of Storybook:

```bash
# From the project root
pnpm --filter @popcorntime/ui storybook:build

# Or from the UI package directory
cd packages/popcorntime-ui
pnpm storybook:build
```

The static build will be created in `packages/popcorntime-ui/storybook-static/`.

## Component Coverage

The following components have comprehensive Storybook documentation:

### Core Components (11/10+ required)
1. **Button** - Multiple variants, sizes, with/without icons, disabled states
2. **Input** - Different types, validation states, with labels
3. **Dialog** - Modal dialogs with forms, confirmation, scrollable content
4. **Tooltip** - Multiple positions, with icons, keyboard accessible
5. **Toggle** - Variants, sizes, icon toggles, disabled states
6. **Badge** - Status indicators, with icons, categories
7. **Checkbox** - States, with labels, validation, hierarchical
8. **Avatar** - Images, fallbacks, sizes, groups
9. **Label** - Form association, required fields, validation
10. **Separator** - Horizontal/vertical, navigation, custom styling
11. **Tabs** - Multiple tabs, with icons, compact design, disabled

## Features

### Interactive Controls

All stories include interactive controls that allow you to:
- Modify component props in real-time
- Test different states and variations
- Copy code snippets for implementation

### Accessibility Testing

Storybook includes the `@storybook/addon-a11y` addon which automatically:
- Runs axe-core accessibility tests
- Highlights accessibility violations
- Provides suggestions for improvements

### Documentation

Components include:
- **Args tables** - Automatically generated from TypeScript props
- **Usage examples** - Multiple story variations showing common use cases
- **MDX documentation** - Extended documentation with guidelines (see `button.mdx`)

## Writing Stories

Stories follow the Component Story Format (CSF) 3.0. Here's a basic template:

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from './component-name'

const meta = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Description of what this component does.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls for props
  },
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // Default props
  },
}
```

## CI/CD Integration

The project includes automated workflows that:

1. **Build** - Builds Storybook on every PR
2. **Test** - Runs interaction tests against stories
3. **Accessibility** - Performs automated a11y audits
4. **Artifacts** - Uploads static build for review

## Best Practices

### Story Organization
- Group related stories under the same component
- Use descriptive names that explain the use case
- Include both simple and complex examples

### Accessibility
- Always include proper labels and ARIA attributes
- Test with keyboard navigation
- Ensure sufficient color contrast

### Documentation
- Include descriptions for complex components
- Show different states (loading, error, success)
- Provide realistic data and content

## Troubleshooting

### Build Issues
- Ensure all dependencies are installed: `pnpm install`
- Clear node_modules and reinstall if needed
- Check for TypeScript errors: `pnpm --filter @popcorntime/ui type-check`

### Missing Stories
- Stories must be in the `src/` directory
- Files must match pattern: `*.stories.@(js|jsx|mjs|ts|tsx)`
- Ensure proper imports and exports

### Styling Issues
- Tailwind CSS is automatically configured
- Global styles are imported in `.storybook/preview.tsx`
- Custom fonts and CSS variables are available