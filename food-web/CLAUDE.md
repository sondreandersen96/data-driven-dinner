# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Food Web is a recipe management application built with React, TypeScript, and Vite. Users can create, view, edit, and manage recipes and ingredients. The app is secured with Keycloak authentication and connects to a backend API service.

## Commands

```bash
# Install dependencies
npm install

# Start development server (port 3001)
npm run dev

# Build for production
npm run build

# Type check without emitting
npm run typecheck

# Preview production build
npm run serve

# Lint (no script defined, run manually)
npx eslint src/
```

## Architecture

### Tech Stack
- **Vite + React 18 + TypeScript** with SWC compiler
- **TanStack Router** - File-based routing with automatic code splitting
- **TanStack React Query** - Data fetching and caching
- **TanStack React Form** - Form state management
- **Keycloak** - OpenID Connect authentication
- **CSS Modules** for component styling

### Key Directories
- `src/routes/` - File-based routes (auto-generates `routeTree.gen.ts` - never edit manually)
- `src/components/` - Shared components
- `src/api/` - API client and React Query hooks
- `src/domain/` - TypeScript interfaces (Recipe, Ingredient, RecipeIngredient)

### Routing Convention
Routes follow TanStack Router file-based conventions:
- `routes/index.tsx` → `/`
- `routes/recipes/$recipeId/` → `/recipes/:recipeId`
- `routes/*/-components/` → Route-specific components (prefixed with `-` to exclude from routing)

### API Communication
- Production: `https://food.sondreandersen.dev/api`
- Development: `http://localhost:8080`
- All requests include Bearer token from Keycloak
- API client in `src/api/recipeServiceClient.ts`

### Authentication
Keycloak authentication is required on app load. Configuration in `src/keycloak.ts`:
- Realm: `data-driven-dinner`
- Client ID: `food-web`
- Uses PKCE (S256)

### Environment Detection
`src/globals.ts` exports `PROD` boolean based on Vite's build mode.

## Development Notes

- Backend API must be running (dev: localhost:8080)
- CSS Modules imports use `//@ts-ignore` comments due to TypeScript limitations
- TypeScript strict mode with `noUnusedLocals` and `noUnusedParameters` enabled
- Path alias: `@/*` maps to `src/*`
