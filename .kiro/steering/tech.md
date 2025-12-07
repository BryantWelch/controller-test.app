# Technology Stack

## Core Technologies

- **React 19.0.0**: Modern React with latest features
- **TypeScript 4.9.5**: Static typing for JavaScript
- **React Router DOM 7.4.0**: Client-side routing
- **Styled Components 6.1.16**: CSS-in-JS styling solution
- **Framer Motion 12.6.2**: Animation library for smooth transitions

## Build System

- **Create React App**: Standard React build toolchain
- **React Scripts 5.0.1**: Build, test, and development scripts

## Key Libraries

- **React Helmet 6.1.0**: Document head management
- **React Icons 5.5.0**: Icon library
- **Web Vitals 2.1.4**: Performance monitoring

## Testing

- **Jest**: Test runner (via React Scripts)
- **React Testing Library 16.2.0**: Component testing utilities
- **Testing Library DOM 10.4.0**: DOM testing utilities
- **Testing Library User Event 13.5.0**: User interaction simulation

## Development Tools

- **ESLint**: Code linting with React app configuration
- **TypeScript Compiler**: Type checking

## Common Commands

```bash
# Development
npm start              # Start development server on localhost:3000
npm run build         # Create production build
npm test              # Run test suite
npm run lint          # Run ESLint on source files
npm run typecheck     # Run TypeScript type checking without emitting files

# Package Management
npm install           # Install dependencies
npm ci                # Clean install from package-lock.json
```

## Browser APIs

- **Gamepad API**: Core functionality for controller detection and input
- **Performance API**: For timing and latency measurements
- **RequestAnimationFrame**: For smooth real-time updates

## TypeScript Configuration

- Target: ES5 for broad compatibility
- Strict mode enabled
- JSX: react-jsx (new JSX transform)
- Module resolution: Node.js style