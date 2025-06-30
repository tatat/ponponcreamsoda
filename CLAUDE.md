# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development

```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production (static export)
npm start            # Start production server
```

### Testing

```bash
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:ui      # Run tests with Vitest UI
```

### Code Quality

```bash
npm run lint         # Run Next.js linter
npm run format       # Format code with Prettier
```

**IMPORTANT: Always run lint, format, and type-check after making changes:**

```bash
npm run lint         # Check for ESLint errors
npm run format       # Format code with Prettier
npm run type-check   # Check for TypeScript type errors
```

## Architecture Overview

This is a Next.js 15+ TypeScript project for the Pon Pon Creamsoda doujin circle website using App Router with static export.

### Key Technologies

- **Next.js 15+** with App Router (static export mode)
- **TypeScript** with strict mode
- **Emotion** for CSS-in-JS with theme support
- **Phaser 3** for the breakout game
- **Firebase** for analytics
- **Vitest** for testing with jsdom environment

### Project Structure

- `/src/app/` - Next.js App Router pages and routes
  - `/books/[01-05]/` - Individual book pages with video/image backgrounds
  - `/games/breakout-clone/` - Phaser-based game with modular architecture
  - `/gallery/` - Image gallery page
  - `/item-list/` - Product listing page
- `/src/components/` - Shared React components
- `/src/helpers/` - Utility functions with Phaser-specific assertions
- `/src/hooks/` - Custom React hooks for menu and breakpoint handling
- `/public/` - Static assets (images, videos, game assets)

### Important Configuration

- **Environment Variables**: Required Firebase and gallery configuration in `.env.local`:
  - `NEXT_PUBLIC_SITE_ORIGIN`
  - `NEXT_PUBLIC_FIREBASE_*` (API key, auth domain, etc.)
  - `NEXT_PUBLIC_GALLERY_DRIVE_FOLDER_ID`
- **Static Export**: Site is built as static HTML (`output: 'export'` in next.config.js)
- **Trailing Slashes**: Enabled for all routes
- **Path Alias**: `@/` maps to `./src/`

### Phaser Game Integration

The breakout-clone game uses:

- Dynamic imports with `ssr: false` to prevent server-side rendering
- Modular architecture with separate managers (Boss, Sound, UI, Controls)
- Custom cleanup utilities for proper Phaser object destruction
- Settings persistence and debug mode support

### Testing Approach

- Vitest with jsdom for React component testing
- Custom test setup in `/src/test/setup.ts`
- Phaser-specific assertion helpers in `/src/helpers/phaser-assertions.ts`
- Run individual tests with: `npm run test -- path/to/test.ts`
