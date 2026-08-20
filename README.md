# Portfolio v3

A production-quality Creative Portfolio website built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **Icons**: Phosphor Icons
- **Fonts**: Satoshi Variable (local), Oxygen Mono (Google Fonts)

## Project Structure

```
portfolio_v3/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with fonts and metadata
│   └── page.tsx           # Home page
├── src/
│   ├── components/
│   │   ├── ui/            # Atomic UI components
│   │   │   ├── Button.tsx
│   │   │   └── Card.tsx
│   │   └── layout/        # Structural components
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── styles/
│   │   └── globals.css    # Global styles and CSS custom properties
│   ├── tokens/            # Design tokens as TypeScript constants
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   ├── motion.ts
│   │   ├── layout.ts
│   │   ├── components.ts
│   │   └── index.ts
│   └── utils/
│       └── cn.ts          # className utility (clsx + tailwind-merge)
└── public/
    └── fonts/             # Font files
        └── Satoshi-Variable.ttf (add this file)
```

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Add the Satoshi Variable font**:
   - Download `Satoshi-Variable.ttf` from [Fontshare](https://www.fontshare.com/fonts/satoshi) or your font source
   - Place it in `public/fonts/Satoshi-Variable.ttf`

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Design System

This project follows a strict design system with tokens defined in `src/tokens/`. All design decisions should reference these tokens rather than hardcoding values.

### Key Design Principles

- **Layout**: Contained layout — max-width 1200px, 12-column grid
- **Spacing**: Balanced spacing — base unit 16px
- **Surfaces**: Small corners (4px or 8px), flat design
- **Motion**: Snappy motion — fast feedback (60ms-300ms)
- **Color**: Primary #27E5EF + Accent #FFC000 — vibrant, saturated palette
- **Type**: Satoshi Variable (primary text), Oxygen Mono (decorative elements)

## Building for Production

```bash
npm run build
npm start
```

## SEO & Performance

- Semantic HTML structure
- Meta tags and Open Graph support
- Static generation where possible
- Optimized font loading
- Above-the-fold performance priority
