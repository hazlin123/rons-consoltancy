# Rons Future Bridge Consultancy - Monorepo

A modern monorepo containing the public website and admin portal for Rons Future Bridge Consultancy.

## 📁 Structure

```
rons-future-bridge/
├── apps/
│   ├── website/          # Public marketing site (company.com)
│   └── portal/           # Admin dashboard (portal.company.com)
├── packages/
│   ├── ui/               # Shared UI components
│   ├── config/           # Shared configurations
│   └── utils/            # Shared utilities
└── package.json          # Root workspace config
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation
```bash
pnpm install
```

### Development
```bash
# Run both apps
pnpm dev

# Run website only
pnpm dev:website

# Run portal only
pnpm dev:portal
```

### Build
```bash
# Build both apps
pnpm build

# Build website only
pnpm build:website

# Build portal only
pnpm build:portal
```

## 📦 Apps

### Website (`apps/website`)
Public-facing marketing site featuring:
- Homepage with IELTS coaching information
- University partnerships showcase
- Student success stories
- Contact form

**URL:** company.com  
**Tech:** React + Vite + Tailwind CSS

### Portal (`apps/portal`)
Admin dashboard for tracking student progress:
- Student management
- Stage tracking (IELTS → School → Visa)
- Reports and analytics
- Secure authentication

**URL:** portal.company.com  
**Tech:** React + Vite + Tailwind CSS + Supabase

## 📦 Packages

### `@rons/ui`
Shared UI components built with shadcn/ui

### `@rons/config`
Shared configuration files (Tailwind, TypeScript)

### `@rons/utils`
Shared utilities (Supabase client, auth, types)

## 🔧 Development

This monorepo uses pnpm workspaces for dependency management. Each app and package can be developed independently while sharing common code.

## 📝 License

Private - Rons Future Bridge Consultancy
