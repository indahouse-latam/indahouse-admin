# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Indahouse Admin is a Next.js 14 (App Router) admin dashboard for managing real estate tokenization campaigns on Base/Base Sepolia blockchain networks. It integrates with wagmi/viem for Web3 interactions and uses React Query for server state management.

## Development Commands

```bash
# Install dependencies
bun install
# or npm install

# Run development server (http://localhost:3000)
bun dev
# or npm run dev

# Build for production
bun build
# or npm run build

# Start production server
bun start
# or npm start

# Lint code
bun lint
# or npm run lint
```

## Architecture

### Provider Hierarchy (layout.tsx)

The app uses a strict provider hierarchy that must be maintained:

1. **AuthProvider** - Handles authentication via Google OAuth tokens and localStorage
   - Auto-redirects to `/login` if unauthenticated
   - Stores user session in `localStorage` as `admin_user`
   - Provides `useAuth()` hook

2. **ContractsProvider** - Manages smart contract addresses across deployment batches
   - Loads/saves contract config from `localStorage` as `contracts_config`
   - Provides `useContracts()` hook with batch1-5 addresses
   - Fallback addresses defined in `src/providers/ContractsProvider.tsx`

3. **Web3Provider (Providers)** - Wraps wagmi configuration
   - Supports Base (mainnet) and Base Sepolia (testnet)
   - Config in `src/config/wagmi.ts`

### Module Structure

The codebase follows a feature-based module organization:

```
src/
├── app/                      # Next.js App Router pages
│   ├── assets/              # Asset management pages
│   ├── campaigns/           # (Implicitly handled by modules/campaigns)
│   ├── history/             # History and logs pages
│   ├── login/               # Login page
│   ├── markets/             # Markets overview
│   ├── onboarding/          # User onboarding
│   └── users/               # User management
├── modules/                 # Feature modules
│   ├── campaigns/           # Campaign CRUD operations
│   │   ├── components/      # CreateCampaignModal, RegisterPropertyModal
│   │   └── hooks/           # useCampaigns (React Query hooks)
│   ├── financials/          # Financial movements and rent claims
│   ├── markets/             # Market data and stats
│   └── users/               # User management logic
├── components/              # Shared UI components
│   ├── AdminLayout.tsx      # Main layout with Sidebar + Header
│   ├── DataTable.tsx        # Generic data table component
│   ├── DragDropUpload.tsx   # File upload component
│   └── LocationFields.tsx   # Google Maps autocomplete fields
├── config/                  # Configuration files
│   ├── contracts.ts         # Smart contract addresses per network
│   ├── abis.ts             # Contract ABIs
│   └── wagmi.ts            # Wagmi/Web3 config
├── hooks/                   # Global hooks
│   ├── useContracts.ts     # Access ContractsContext
│   └── usePlacesAutocomplete.ts # Google Maps autocomplete
├── providers/               # React context providers
├── services/                # External services (e.g., BucketService)
└── utils/
    └── api.ts              # Centralized API client (fetchApi)
```

### Data Fetching Pattern

All API calls use:
- **fetchApi** (`src/utils/api.ts`) - Centralized fetch wrapper
  - Auto-injects `Authorization: Bearer <token>` from localStorage
  - Auto-injects `UserId` header (defaults to '1' for bypass)
  - Base URL from `NEXT_PUBLIC_API_URL` env variable
  - Logs all requests/responses to console with 🌐/✅/❌ prefixes

- **React Query** (TanStack Query) - All module hooks use `useQuery` and `useMutation`
  - Example: `useCampaigns()` in `src/modules/campaigns/hooks/useCampaigns.ts`
  - Query keys: `['campaigns']`, `['users']`, `['markets']`, etc.
  - Always invalidate queries on successful mutations

### Smart Contract Integration

- **Contract addresses**: Defined in `src/config/contracts.ts`
  - `CONTRACTS.baseSepolia` - Testnet addresses
  - `CONTRACTS.base` - Mainnet addresses
  - Key contracts: `indaRoot`, `commitFactory`, `tokenFactory`, `adminAddress`

- **Dynamic contract config**: Managed by ContractsProvider
  - Organized in deployment batches (batch1-5)
  - Can be updated via `updateContracts()` or reset via `resetContracts()`

### Styling

- **Tailwind CSS 4** (using `@import "tailwindcss"` with `@theme` directive)
- Custom theme defined in `src/app/globals.css`:
  - Primary colors: Indigo palette (--color-primary-*)
  - Secondary: Gray palette (--color-secondary-*)
  - Success: Green palette (--color-success-*)
  - Destructive: Red palette (--color-destructive-*)
  - Custom radius variables (--radius-sm/md/lg/xl/2xl)

- Dark mode is forced via `className="dark"` in layout.tsx

### Environment Variables

Required in `.env`:
```
NEXT_PUBLIC_API_URL            # Backend API base URL
NEXT_PUBLIC_WALLET_URL         # Wallet API URL
NEXT_PUBLIC_WALLET_API_KEY     # Wallet API key
NEXT_PUBLIC_GOOGLE_MAPS_KEY    # Google Maps API key for location fields
```

## Key Integration Points

### Google Maps Integration

- Uses `@react-google-maps/api` library
- `usePlacesAutocomplete` hook in `src/hooks/usePlacesAutocomplete.ts`
- `LocationFields` component provides autocomplete for addresses
- API key from `NEXT_PUBLIC_GOOGLE_MAPS_KEY`

### Web3/Blockchain Integration

- Uses wagmi v3 + viem v2
- Supports Base and Base Sepolia chains
- No wallet connection UI in admin (server-side contract interactions expected)
- ABIs stored in `src/config/abis.ts`

### File Uploads

- `DragDropUpload` component uses `react-dropzone`
- `BucketService` (`src/services/BucketService.ts`) handles file operations

## Common Patterns

### Creating a new module

1. Create `src/modules/<module-name>/` directory
2. Add `hooks/use<ModuleName>.ts` with React Query hooks
3. Add `components/` for module-specific UI
4. Create page in `src/app/<module-name>/page.tsx`
5. Use `fetchApi` from `src/utils/api.ts` for all API calls

### Adding a new smart contract

1. Update `src/config/contracts.ts` with new address
2. Add ABI to `src/config/abis.ts`
3. If part of deployment batches, update ContractsProvider DEFAULT_CONFIG

### Authentication Flow

1. User redirected to `/login` if no token
2. OAuth flow returns `sessionToken` in URL params (`?token=...` or `?sessionToken=...`)
3. AuthProvider calls `/auth/login` API endpoint with token
4. On success, stores `{ email, id, token }` in localStorage as `admin_user`
5. All API calls auto-inject this token via fetchApi

## Important Notes

- All API interactions go through `fetchApi` - never use raw fetch
- All state management for server data uses React Query
- Smart contract addresses are environment-dependent (Base vs Base Sepolia)
- The app expects to be wrapped in AuthProvider, ContractsProvider, and Web3Provider
- Authentication token stored in localStorage persists across sessions
- Console logs are extensive for debugging (🌐 requests, ✅ success, ❌ errors)
