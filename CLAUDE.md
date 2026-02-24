# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Indahouse Admin is a Next.js 14 (App Router) admin dashboard for managing real estate tokenization campaigns on Polygon Amoy (primary testnet), Base, and Base Sepolia blockchain networks. It integrates with viem v2 for Web3 interactions and uses React Query for server state management.

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
   - Supports Polygon Amoy (primary), Base (mainnet), and Base Sepolia (testnet)
   - Config in `src/config/wagmi.ts`
   - Default network: Polygon Amoy (Chain ID: 80002)

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

- **Primary Network**: Polygon Amoy (Chain ID: 80002)
- **Contract addresses**: Defined in `src/config/contracts.ts`
  - `currentContracts` (QA = Polygon Amoy, Production = Polygon)
  - `CONTRACTS.baseSepolia` - Base testnet
  - `CONTRACTS.base` - Base mainnet
  - Key contracts: `indaRoot`, `PropertyRegistry`, `commitFactory`, `tokenFactory`, `manager`

- **Dynamic contract config**: Managed by ContractsProvider
  - Organized in deployment batches (batch1-5)
  - Can be updated via `updateContracts()` or reset via `resetContracts()`

- **Blockchain utilities**: `src/utils/blockchain.utils.ts`
  - See "Web3/Blockchain Integration" section for detailed usage

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
NEXT_PUBLIC_APP_ENV            # "qa" (develop) or "production" (main). Default: qa
```

See **ENV.md** and `.env.qa.example` / `.env.production.example` for QA vs Production setup (main → production, develop → qa).

## Key Integration Points

### Google Maps Integration

- Uses `@react-google-maps/api` library
- `usePlacesAutocomplete` hook in `src/hooks/usePlacesAutocomplete.ts`
- `LocationFields` component provides autocomplete for addresses
- API key from `NEXT_PUBLIC_GOOGLE_MAPS_KEY`

### Web3/Blockchain Integration

**Environment-based network**: QA (develop) uses Polygon Amoy (80002); Production (main) uses Polygon Mainnet (137). Controlled by `NEXT_PUBLIC_APP_ENV`.

#### Network Configuration (`src/config/contracts.ts`)

- **`currentContracts`** – Contratos de la red activa (usar en lugar de `CONTRACTS.polygonAmoy`).
- **`DEFAULT_CHAIN_ID`** – 80002 (QA) o 137 (Production).
- **`CONTRACTS_NETWORK`** – `"polygonAmoy"` o `"polygon"` según entorno.

Redes disponibles en `CONTRACTS`: `polygonAmoy` (QA), `polygon` (Production, placeholders), `baseSepolia`, `base`.

#### ABIs Structure (`src/config/abis.ts`)

The file exports ABIs as TypeScript constants with `as const` assertion:

**Available ABIs**:
- `IndaRootAbi` - Main contract with AccessControl (lines 1097+)
  - Supports: `grantRole`, `hasRole`, `_setToWhitelist`, property management
  - Uses OpenZeppelin AccessControl pattern

- `PropertyRegistryAbi` - Property registration (lines 5321+)
  - Supports: `grantRole`, `hasRole`, `registerProperty`
  - Uses OpenZeppelin AccessControl pattern

- `IndaPropertiesAbi` - Property NFTs
  - Uses Ownable pattern (NOT AccessControl)
  - Functions: `mint`, `burn`, `transferOwnership`

- `CommitCampaignAbi` - Campaign contracts
- `TokenFactoryAbi` - Token creation
- `IndaAdminRouterAbi` - Admin routing (lines 6573+)
  - No AccessControl (uses custom admin pattern)

**ABI Format Example**:
```typescript
{
  type: "function",
  name: "grantRole",
  inputs: [
    { name: "role", type: "bytes32", internalType: "bytes32" },
    { name: "account", type: "address", internalType: "address" }
  ],
  outputs: [],
  stateMutability: "nonpayable"
}
```

#### Blockchain Utilities (`src/utils/blockchain.utils.ts`)

**Core Functions**:

1. **User Wallet Client** (uses authenticated user's wallet):
   ```typescript
   createUserWalletClient(chainId?: number)
   // - Fetches private key from Nyx Wallet API using user's token
   // - Creates viem wallet client with user's account
   // - Used for user-initiated transactions
   ```

2. **Public Client** (read-only):
   ```typescript
   createUserPublicClient(chainId?: number)
   // - Creates public client for reading blockchain data
   // - Used for hasRole checks, contract state queries
   ```

3. **Execute Contract Write**:
   ```typescript
   executeContractWrite<TAbi>({
     contractAddress: `0x${string}`,
     abi: TAbi,
     functionName: string,
     args: any[],
     chainId?: number,
     gasLimit?: bigint
   })
   // - Executes transaction using user's wallet
   // - Returns transaction hash
   ```

4. **Custom Private Key Operations** (for admin operations):
   ```typescript
   createWalletClientWithKey(privateKey: `0x${string}`, chainId?: number)
   // - Creates wallet client with custom private key
   // - Used in /roles page for granting permissions

   executeContractWriteWithKey<TAbi>({
     privateKey: `0x${string}`,
     contractAddress: `0x${string}`,
     abi: TAbi,
     functionName: string,
     args: any[],
     chainId?: number
   })
   // - Executes transaction with custom private key
   // - Used when admin needs to sign with specific wallet
   ```

5. **Role Verification**:
   ```typescript
   checkHasRole({
     contractAddress: `0x${string}`,
     abi: Abi,
     role: `0x${string}`,
     account: `0x${string}`,
     chainId?: number
   }): Promise<boolean>
   // - Checks if account has role on contract
   // - Uses public client (no gas required)
   ```

6. **Transaction Confirmation**:
   ```typescript
   waitForTransaction({
     hash: Hash,
     chainId?: number,
     confirmations?: number
   }): Promise<TransactionReceipt>
   // - Waits for transaction to be mined
   // - Default: 1 confirmation
   ```

#### Role-Based Access Control System

**Contracts Using AccessControl**:
- `IndaRoot` - Core permissions
- `PropertyRegistry` - Property management permissions

**Role Hashes** (keccak256 of role names):
```typescript
PROPERTIES_MANAGER_ROLE = "0x5caba2aa072f9476eef4eba05f22235aef4612b73d339428b33d92eca0aabf20"
USER_MANAGER_ROLE       = "0x5ebedfa6104e4963a67c17c9b73e50a627c5307e1a07c68dd391bb0e4fc974d3"
GOVERNANCE_ROLE         = "0x71840dc4906352362b0cdaf79870196c8e42acafade72d5d5a6d59291253ceb1"
DEFAULT_ADMIN_ROLE      = "0x0000000000000000000000000000000000000000000000000000000000000000"
```

**Role Purposes**:
| Role | Used For | Contracts |
|------|----------|-----------|
| `PROPERTIES_MANAGER_ROLE` | Register/manage properties | IndaRoot, PropertyRegistry |
| `USER_MANAGER_ROLE` | Whitelist users/campaigns (`_setToWhitelist`) | IndaRoot |
| `GOVERNANCE_ROLE` | Execute property buyouts | IndaRoot, PropertyRegistry |
| `DEFAULT_ADMIN_ROLE` | Grant/revoke other roles | All AccessControl contracts |

**Granting Roles**:
```typescript
// Example: Grant USER_MANAGER_ROLE to admin
await executeContractWriteWithKey({
  privateKey: masterWalletKey,
  contractAddress: currentContracts.indaRoot,
  abi: IndaRootAbi,
  functionName: 'grantRole',
  args: [USER_MANAGER_ROLE, adminAddress],
  chainId: 80002
});
```

**Checking Roles**:
```typescript
const hasRole = await checkHasRole({
  contractAddress: currentContracts.indaRoot,
  abi: IndaRootAbi,
  role: USER_MANAGER_ROLE,
  account: adminAddress,
  chainId: 80002
});
```

#### Common Blockchain Patterns

**Pattern 1: Read Contract State**
```typescript
const publicClient = createUserPublicClient(80002);
const result = await publicClient.readContract({
  address: currentContracts.indaRoot,
  abi: IndaRootAbi,
  functionName: 'hasRole',
  args: [roleHash, accountAddress]
});
```

**Pattern 2: Execute Transaction with User Wallet**
```typescript
const hash = await executeContractWrite({
  contractAddress: currentContracts.PropertyRegistry,
  abi: PropertyRegistryAbi,
  functionName: 'registerProperty',
  args: [propertyData],
  chainId: 80002
});

const receipt = await waitForTransaction({ hash, chainId: 80002 });
```

**Pattern 3: Execute Transaction with Custom Key** (Admin only)
```typescript
const hash = await executeContractWriteWithKey({
  privateKey: customPrivateKey,
  contractAddress: currentContracts.indaRoot,
  abi: IndaRootAbi,
  functionName: 'grantRole',
  args: [roleHash, targetAddress],
  chainId: 80002
});
```

#### RPC Endpoints

Configured in `blockchain.utils.ts`:
- **Polygon Amoy**: `https://rpc-amoy.polygon.technology`
- **Base Sepolia**: `https://sepolia.base.org`
- **Base Mainnet**: `https://mainnet.base.org`

#### Important Notes

- **Primary network is Polygon Amoy** (80002), not Base
- Always use `DEFAULT_CHAIN_ID` from `src/config/contracts.ts`
- Role-based operations require `DEFAULT_ADMIN_ROLE` on the caller
- Some contracts use `Ownable` (IndaProperties) instead of `AccessControl`
- Transaction errors often indicate missing roles - check with `hasRole` first
- All blockchain operations are logged to console with transaction hashes

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
- **Primary blockchain network is Polygon Amoy (Chain ID: 80002)**
- Smart contract addresses are network-dependent (Polygon Amoy, Base, Base Sepolia)
- The app expects to be wrapped in AuthProvider, ContractsProvider, and Web3Provider
- Authentication token stored in localStorage persists across sessions
- Console logs are extensive for debugging (🌐 requests, ✅ success, ❌ errors)
- **Blockchain operations require appropriate roles** - check with `hasRole` before attempting privileged operations
- Use `executeContractWriteWithKey` for admin operations requiring specific private keys
- Use `executeContractWrite` for user-initiated transactions (uses Nyx Wallet)
