# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a collaborative directory of brands with ethical, social, or environmental issues. It allows consumers to make informed purchasing decisions. The application is built with Next.js 15, TypeScript, Tailwind CSS, and uses Supabase as the backend.

## Development Commands

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run type-check       # Run TypeScript type checking
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues automatically

# Production
npm run build           # Build for production
npm run start           # Start production server
npm run analyze         # Analyze bundle size

# Maintenance
npm run clean           # Clean .next directory
```

## Architecture

### Core Structure
- **Next.js 15 App Router**: Uses the new app directory structure
- **TypeScript**: Strict mode enabled with path mapping (`@/*` → `./src/*`)
- **Supabase**: Backend with two main tables: `Marque` and `Evenement`
- **Tailwind CSS**: Styling with custom color palette (orange/amber theme)

### Key Directories
- `src/app/`: Next.js app router pages and API routes
- `src/components/`: Reusable UI components organized by feature
- `src/hooks/`: Custom React hooks (`useSearch`, `useSuggestions`)
- `src/lib/`: Services, utilities, and configurations
- `src/types/`: Centralized TypeScript type definitions

### Data Models
```typescript
interface Marque {
  id: number;
  nom: string;
  evenements?: Evenement[];
}

interface Evenement {
  id: number;
  marqueId: number;
  description: string;
  date: string;
  categorie: string;
  source: string;
  marque?: Marque;
}
```

## API Architecture

### API Routes
- `GET/POST /api/marques`: Brand CRUD operations
- `GET/POST /api/evenements`: Event CRUD operations

### Validation System
All API endpoints use custom validation schemas (`src/lib/validation/schemas.ts`) with detailed error messages in French.

### Supabase Integration
- Client configured in `src/lib/supabaseClient.ts`
- Requires `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables
- Direct database queries using the Supabase client

## Component Patterns

### Search System
The search functionality is built around two main hooks:
- `useSearch`: Handles search state, query execution, and results
- `useSuggestions`: Manages brand suggestions and dropdown visibility

### UI Components
- Follow composition over inheritance pattern
- All components are TypeScript interfaces with proper prop types
- Reusable components in `src/components/ui/`
- Feature-specific components organized by domain

## Development Guidelines

### Code Style
- Strict TypeScript configuration
- French language for user-facing text and error messages
- Consistent naming: camelCase for variables/functions, PascalCase for components
- Path imports using `@/` prefix for src directory

### API Design
- RESTful endpoints with proper HTTP status codes
- Comprehensive error handling with French error messages
- Request validation using custom schemas
- Response format: Direct data return (not wrapped in response objects)

### State Management
- React hooks for local state
- Custom hooks for complex business logic
- No external state management library (Redux, Zustand, etc.)

## Testing & Quality

Before committing changes, always run:
```bash
npm run type-check  # Ensure TypeScript compliance
npm run lint        # Check code quality
```

## Environment Setup

Required environment variables:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Key Files to Understand

- `src/types/index.ts`: All TypeScript definitions
- `src/lib/services/api.ts`: API service layer
- `src/hooks/useSearch.ts`: Search functionality implementation
- `ARCHITECTURE.md`: Detailed technical architecture documentation