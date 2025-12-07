# Project Structure

## Root Directory

```
├── public/           # Static assets and HTML template
├── src/             # Source code
├── .kiro/           # Kiro AI assistant configuration
├── node_modules/    # Dependencies (auto-generated)
├── package.json     # Project configuration and dependencies
├── tsconfig.json    # TypeScript configuration
└── README.md        # Project documentation
```

## Source Code Organization (`src/`)

```
src/
├── components/      # Reusable React components
│   ├── common/      # Generic UI components
│   ├── controller/  # Controller-specific components
│   └── layout/      # Layout and navigation components
├── pages/           # Route-level page components
├── hooks/           # Custom React hooks
│   └── customHooks/ # Specialized hook implementations
├── styles/          # Global styles and theme
├── utils/           # Utility functions and helpers
├── data/            # Static data and configuration
├── assets/          # Images, SVGs, and other assets
├── App.tsx          # Main application component
├── index.tsx        # Application entry point
└── index.css        # Global CSS styles
```

## Architecture Patterns

### Component Organization
- **Pages**: Top-level route components (Home, Test, About, Privacy)
- **Layout**: Shared layout components that wrap page content
- **Common**: Reusable UI components used across the app
- **Controller**: Specialized components for gamepad visualization and interaction

### Custom Hooks Pattern
- **useGamepad.ts**: Main hook for gamepad functionality and state management
- **customHooks/**: Specialized hooks for specific features (browser compatibility, haptic feedback, timing)

### Styling Architecture
- **Styled Components**: CSS-in-JS for component-level styling
- **Theme System**: Centralized design tokens in `styles/theme.ts`
- **Global Styles**: App-wide styles in `styles/globalStyles.ts`

### Utility Organization
- **gamepadUtils.ts**: Core gamepad API utilities and helper functions
- **controllerUtils.ts**: Controller-specific utility functions

## File Naming Conventions

- **Components**: PascalCase (e.g., `Layout.tsx`, `ControllerVisualizer.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useGamepad.ts`)
- **Utils**: camelCase (e.g., `gamepadUtils.ts`)
- **Pages**: PascalCase matching route names (e.g., `Home.tsx`, `Test.tsx`)
- **Types**: PascalCase interfaces and types

## Import Patterns

- Relative imports for local files
- Absolute imports from `src/` root when needed
- Group imports: React first, then third-party, then local imports

## State Management

- React hooks for local component state
- Custom hooks for shared stateful logic
- Context API through ThemeProvider for global theme state
- No external state management library (Redux, Zustand) currently used