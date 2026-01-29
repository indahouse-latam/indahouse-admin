# Indahouse Protocol - Production Deployment & Operations Manual

**Version**: 3.0 | **Classification**: Internal - Engineering Team

---

## Table of Contents

1. [Business Model Overview](#1-business-model-overview)
2. [Core Architecture](#2-core-architecture)
3. [Production Deployment](#3-production-deployment)
4. [Multi-Country Configuration](#4-multi-country-configuration)
5. [Complete Asset Lifecycle](#5-complete-asset-lifecycle)
6. [User Lifecycle](#6-user-lifecycle)
7. [Campaign Operations](#7-campaign-operations)
8. [Post-Campaign Operations](#8-post-campaign-operations)
9. [Governance & Buyout Flow](#9-governance--buyout-flow)
10. [Complete Operation Reference (All 10 Types)](#10-complete-operation-reference)
11. [Database Schema](#11-database-schema)
12. [Subgraph & Accounting Reports](#12-subgraph--accounting-reports)

---

## 1. Business Model Overview

### 1.1 What is Indahouse?

Indahouse is a **fractional real estate investment platform** that tokenizes properties in Latin America (initially Colombia), allowing retail investors to purchase fractional ownership of rental properties using stablecoins (USDC).

### 1.2 Core Value Proposition

| Traditional Real Estate | Indahouse Model |
|------------------------|-----------------|
| High entry barriers ($50k+) | Start from $50 |
| Illiquid (months to sell) | Secondary market liquidity |
| Complex legal paperwork | On-chain ownership via tokens |
| Manual rent collection | Automatic rent distribution |
| Country-specific | Multi-country from one wallet |

### 1.3 Key Entities

- **Properties**: Physical real estate assets tokenized as ERC20 tokens
- **Tokens (INDH-XXX)**: Fractional ownership units representing shares in a property
- **CMD (Membership Certificate)**: User's on-chain "portfolio wallet" that holds their tokens per country
- **Distributor**: Smart contract that accumulates and distributes rental income proportionally
- **PoolVault**: Liquidity pool for secondary market operations
- **Governor**: Governance contract enabling token holders to vote on property sales

### 1.4 Revenue Streams

1. **Investment Fees**: 0.5-1.5% fee on campaign commitments (tiered by timing)
2. **P2P Trading Fees**: Commission on secondary market sales
3. **Property Management**: Off-chain fees for property administration
4. **Buyout Commission**: Fee when a property is fully acquired by a single buyer

---

## 2. Core Architecture

### 2.1 Contract Hierarchy

```
IndahouseRegistry (Central Router Registry)
│   → Maps country codes to their Manager contracts
│   → Single source of truth for contract discovery
│
├── TransactionRouter (Unified Operation Handler)
│   → ALL user-facing operations go through here
│   → Emits OperationRecorded events for indexing
│   → Provides consistent logging across all movements
│
├── IndaRoot (Asset & User Management)
│   → Central hub for token minting, user whitelist, property registration
│   ├── PropertyRegistry → Tracks all properties, prices, buyout status
│   ├── IndaAdmin → Fee configuration, loyalty tiers
│   └── TokenFactory → Deploys new property tokens
│
├── PoolFactory (Distributor Deployer)
│   → Creates IndaDistributor proxies for each property
│
├── ManagerFactory (Country Manager Deployer)
│   → Deploys new Manager contracts when expanding to new countries
│   └── Manager[CountryCode] (Per-Country Instance)
│       → Each country has its own legal structure (LLC Series)
│       ├── MembershipCertificate (CMD) Clones
│       │   → User's "portfolio wallet" for that country
│       ├── PoolVault → Holds liquidity for secondary trading
│       └── IndaDistributor (Per-Token) → Handles rent distribution
│
└── CommitFactory (Campaign Deployer)
    → Creates funding campaigns for new properties
```

### 2.2 Why This Architecture?

**Country Isolation**: Each country has its own `Manager` because:
- Different legal jurisdictions require separate LLC structures
- Users need separate CMDs per country for regulatory compliance
- Tokens from Colombia cannot mix with tokens from Mexico in the same CMD

**Centralized Router**: The `TransactionRouter` exists because:
- CMDs are minimal clones with no external call capabilities
- All operations need consistent logging for accounting
- Simplifies frontend integration (one contract to interact with)

### 2.3 Key Roles (AccessControl)

| Role | Purpose | Who Has It |
|------|---------|------------|
| `DEFAULT_ADMIN_ROLE` | Full system control | Multisig Safe |
| `GOVERNANCE_ROLE` | Property buyout execution | PropertyGovernor contracts |
| `PROPERTIES_MANAGER_ROLE` | Register/retire properties | Admin, IndaRoot, TransactionRouter |
| `USER_MANAGER_ROLE` | Whitelist management | Admin (backend) |
| `MINTER_ROLE` | Mint tokens during campaigns | IndaRoot |

---

## 3. Production Deployment

### 3.1 Security Architecture

**Why Multisig?** A single private key controlling millions in assets is unacceptable. All admin operations route through a **Gnosis Safe (3-of-5 multisig)** post-deployment.

**Deployment Flow**:
1. Deploy using temporary Deployer EOA
2. Transfer all `DEFAULT_ADMIN_ROLE` to Operations Safe
3. Revoke Deployer's roles
4. Secure-delete Deployer private key

```bash
# Deploy all batches
./batch_deploy.sh all

# Post-deployment: Transfer admin to Safe
DEFAULT_ADMIN_ROLE="0x0000000000000000000000000000000000000000000000000000000000000000"

# For each critical contract:
cast send $INDA_ROOT "grantRole(bytes32,address)" $DEFAULT_ADMIN_ROLE $SAFE_ADDRESS
cast send $INDA_ROOT "revokeRole(bytes32,address)" $DEFAULT_ADMIN_ROLE $DEPLOYER_ADDRESS
# Repeat for: Registry, TransactionRouter, ManagerFactory, PropertyRegistry, etc.
```

### 3.2 Critical Addresses

Store these in environment config and database after deployment:

| Address | Purpose |
|---------|---------|
| `INDA_ROOT_PROXY` | Central asset management |
| `TRANSACTION_ROUTER` | User operation handler |
| `REGISTRY` | Contract discovery |
| `MANAGER_FACTORY` | Country expansion |
| `POOL_FACTORY` | Distributor deployment |
| `COMMIT_FACTORY` | Campaign creation |
| `TOKEN_FACTORY` | Token deployment |
| `PROPERTY_REGISTRY` | Property metadata |
| `INDA_ADMIN` | Fee configuration |
| `INDA_ADMIN_ROUTER` | Admin operations |

---

## 4. Multi-Country Configuration

### 4.1 Business Context

Indahouse operates under a **Series LLC structure** where:
- The main LLC (e.g., "Indahouse LATAM") is the parent
- Each country is a Series (sub-LLC) with isolated liability
- Each property within a country is a sub-series

This is mirrored on-chain:
- `ManagerFactory` creates country-level `Manager` contracts
- Each `Manager` manages CMDs and properties for that jurisdiction

### 4.2 Country Codes

Countries use `bytes32` padded ISO codes:
- Colombia: `0x434f00...` (CO)
- Mexico: `0x4d5800...` (MX)
- United States: `0x555300...` (US)

### 4.3 Creating a New Country

**When to use**: Expanding Indahouse to a new jurisdiction.

```bash
# Deploy Manager for Mexico
cast send $MANAGER_FACTORY "createManager(bytes2,address,address,address)" \
  0x4d58 \  # 'MX'
  $INDA_ROOT \
  $TRANSACTION_ROUTER \
  $POOL_TOKEN_IMPL \
  --private-key $ADMIN_KEY
```

**Database Action**: Insert into `countries` table with new `manager_address`.

### 4.4 Multi-CMD User Model

**Business Logic**: A Colombian user investing in both Colombia and Mexico needs:
- 1 CMD in Colombia (managed by `Manager_CO`)
- 1 CMD in Mexico (managed by `Manager_MX`)

**Why?** Each country has different:
- Legal requirements for member registries
- Tax reporting obligations
- KYC/AML procedures

The `countryCode` parameter in router functions automatically routes to the correct Manager/CMD.

---

## 5. Complete Asset Lifecycle

This section details **how to list a new property** on the platform, from empty smart contracts to investor-ready campaign.

### Phase Overview

```
1. Create Distributor  →  Where rent payments will accumulate
2. Create Token        →  The fractional ownership unit
3. Initialize Distrib  →  Link distributor to token
4. Register in Manager →  Make token discoverable
5. Setup Permissions   →  Enable property registration
6. Register Property   →  Set price, activate for sale
```

---

### Step 1: Create Distributor Proxy

**What it does**: Deploys an uninitialized rent distribution contract.

**Why first?** The Token needs to know its Distributor at creation time for reward hook integration.

**When used**: Before every new property token creation.

```bash
cast send $POOL_FACTORY \
  'createDistributorProxy(bytes32,address)' \
  $COUNTRY_CODE \
  $ADMIN_ADDRESS \
  --private-key $ADMIN_KEY
```

**Extract**: `DISTRIBUTOR_PROXY` from `AdminChanged` event logs.

---

### Step 2: Create Token

**What it does**: Deploys a new ERC20 token representing fractional ownership.

**Business context**: Each property gets its own token. 1 token = 1 share of the property. Token symbol reflects property (e.g., `INDH-MEDELLIN-101`).

```bash
cast send $TOKEN_FACTORY \
  'createToken(address,address,string,string,address)' \
  $INDA_ROOT \              # Owner - controls minting
  $DISTRIBUTOR_PROXY \      # Rent distributor
  "Indahouse Medellin 101" \# Human-readable name
  "INDH-MED-101" \          # Symbol
  $USDC_ADDRESS \           # Base token for purchases
  --private-key $ADMIN_KEY
```

---

### Step 3: Initialize Distributor

**What it does**: Links the Distributor to its token and reward currency.

**Why separate?** Circular dependency - token needs distributor address, distributor needs token address. Create both first, then link.

```bash
cast send $DISTRIBUTOR_PROXY \
  'initialize(address,address,address,string)' \
  $TOKEN_ADDRESS \     # Token to track holdings for
  $USDC_ADDRESS \      # Reward token (rent is paid in USDC)
  $INDA_ROOT \         # For whitelist checks
  "Distributor-MED-101" \
  --private-key $ADMIN_KEY
```

---

### Step 4: Register Token in Manager

**What it does**: Makes the token discoverable by the country's Manager.

**Business context**: The Manager maintains a registry of all properties available in that country. This enables:
- CMD token initialization
- Distributor lookups
- Portfolio queries

```bash
cast send $MANAGER_CO \
  'registerIndividualToken(address,address,string)' \
  $TOKEN_ADDRESS \
  $DISTRIBUTOR_PROXY \
  "MED-101" \   # Short symbol for display
  --private-key $ADMIN_KEY
```

---

### Step 5: Grant Permissions & Link Registry

**What it does**: Establishes the security permissions for property lifecycle management.

**Why needed?** The PropertyRegistry needs authorization to:
- Register new properties
- Update property status (Active → Buyout → Retired)
- Mint property NFTs for legal record

**When used**: Once per deployment, or when adding new admin addresses.

```bash
PROPERTIES_MANAGER_ROLE="0x5caba2aa072f9476eef4eba05f22235aef4612b73d339428b33d92eca0aabf20"
MINTER_ROLE="0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"
NFT_PROP_MANAGER_ROLE="0x32434a10a120a3093796cdca62629674c098d21f8d44da14916ca1fc0fa6963f"

# 5.1 Admin can register properties
cast send $PROPERTY_REGISTRY 'grantRole(bytes32,address)' $PROPERTIES_MANAGER_ROLE $ADMIN_ADDRESS

# 5.2 Admin can manage properties on IndaRoot
cast send $INDA_ROOT 'grantRole(bytes32,address)' $PROPERTIES_MANAGER_ROLE $ADMIN_ADDRESS

# 5.3 IndaRoot can update PropertyRegistry (for buyouts)
cast send $PROPERTY_REGISTRY 'grantRole(bytes32,address)' $PROPERTIES_MANAGER_ROLE $INDA_ROOT

# 5.4 Link contracts
cast send $INDA_ROOT 'setPropertyRegistry(address)' $PROPERTY_REGISTRY

# 5.5 PropertyRegistry can mint property NFTs
cast send $INDA_ROOT 'grantRoleOnExternalContract(address,bytes32,address)' $INDAPROPERTIES $MINTER_ROLE $PROPERTY_REGISTRY
cast send $INDA_ROOT 'grantRoleOnExternalContract(address,bytes32,address)' $INDAPROPERTIES $NFT_PROP_MANAGER_ROLE $PROPERTY_REGISTRY
```

---

### Step 6: Register Property

**What it does**: Creates the official property record with pricing.

**Business context**: This sets the **price per token** that will be used for:
- Campaign token minting (how many tokens per USDC)
- Buyout cost calculations
- UI display

```bash
cast send $PROPERTY_REGISTRY \
  'registerProperty(bytes32,address,uint256,uint64)' \
  $COUNTRY_CODE \
  $TOKEN_ADDRESS \
  50000 \           # $0.05 per token (6 decimals)
  $(date +%s) \     # Sale start timestamp
  --private-key $ADMIN_KEY
```

---

## 6. User Lifecycle

This section covers the **complete user journey** from signup to first investment.

### 6.1 Wallet Generation

**Business Model**: Indahouse uses **non-custodial wallets** where users maintain control but don't need to manage seed phrases.

**How it works**:
1. User signs up with email
2. Backend generates wallet keypair
3. Private key encrypted and stored in **Google Cloud KMS**
4. User authenticates via email/2FA to sign transactions
5. User can export key anytime (self-sovereign)

**Why this approach?**
- Regulatory compliance (not custodial = not a money transmitter)
- User experience (no MetaMask required)
- Recovery possible via email verification

---

### 6.2 Grant USER_MANAGER Role

**What it does**: Allows the backend to manage user whitelists.

**When used**: Once during initial deployment setup.

**Why needed**: Only addresses with this role can call `_setToWhitelist`.

```bash
USER_MANAGER_ROLE="0x5ebedfa6104e4963a67c17c9b73e50a627c5307e1a07c68dd391bb0e4fc974d3"

cast send $INDA_ROOT \
  'grantRole(bytes32,address)' \
  $USER_MANAGER_ROLE \
  $ADMIN_ADDRESS \
  --private-key $ADMIN_KEY
```

---

### 6.3 Whitelist Users

**What it does**: Marks addresses as approved for platform participation.

**Business Context**: Whitelisting is required for:
- Regulatory compliance (KYC verification)
- Accredited investor checks (where required)
- Preventing unauthorized token transfers

**Who gets whitelisted**:
- Users (after KYC approval)
- TransactionRouter (to execute operations)
- IndaAdminRouter (for admin operations)
- PoolVault (to claim rewards)
- Campaigns (to receive investments)

```bash
cast send $INDA_ROOT \
  '_setToWhitelist(address[],bool[])' \
  "[$USER_ADDRESS,$TRANSACTION_ROUTER,$INDA_ADMIN_ROUTER,$POOL_VAULT]" \
  "[true,true,true,true]" \
  --private-key $ADMIN_KEY
```

---

### 6.4 Create CMD (Membership Certificate)

**What it does**: Deploys a personal "portfolio wallet" for the user in a specific country.

**Business Context**: The CMD is the user's on-chain representation in the Series LLC. It:
- Holds all their property tokens for that country
- Tracks their investment history
- Enables rent claims via the Distributor
- Serves as legal proof of membership

**Important**: Users need ONE CMD per country.

```bash
cast send $MANAGER_CO \
  'createCertificate(address)' \
  $USER_ADDRESS \
  --private-key $ADMIN_KEY

# Retrieve CMD address
cast call $MANAGER_CO 'userCertificates(address)(address)' $USER_ADDRESS
```

---

### 6.5 Mint CMD NFT

**What it does**: Creates an NFT representing the user's membership certificate.

**Business Context**: The NFT serves as:
- Visual proof of membership for the user's wallet
- Metadata link to legal documents (stored on IPFS)
- Collectible that enhances user engagement

```bash
cast send $INDA_ADMIN_ROUTER \
  'mintCertificateToUser(bytes32,address,string)' \
  $COUNTRY_CODE \
  $USER_ADDRESS \
  "ipfs://QmXXX/membership-certificate.json" \
  --private-key $ADMIN_KEY
```

---

### 6.6 Assign Loyalty Level

**What it does**: Sets fee tier for the user based on their investment history.

**Business Context**: Loyalty levels reduce investment fees:
- **Bronze (0)**: 3% fee - New investors
- **Silver (1)**: 2% fee - $10k+ total invested
- **Gold (2)**: 1% fee - $100k+ total invested

```bash
cast send $INDA_ROOT \
  '_setUsersLoyalties(address[],uint8[])' \
  "[$USER_ADDRESS]" \
  "[0]" \  # Bronze
  --private-key $ADMIN_KEY
```

---

### 6.7 Subscribe Referrer (Optional)

**What it does**: Links user to their referrer for commission tracking.

**Business Context**: Referral program where existing users earn commissions on referee investments.

```bash
# User subscribes to their referrer
cast send $INDA_ROOT \
  'subscribe(address)' \
  $REFERRER_ADDRESS \
  --private-key $USER_KEY
```

---

### 6.8 Fund User with Native Token

**What it does**: Sends POL (Polygon's native token) for gas fees.

**When used**: When user has 0 POL balance (new users).

```bash
cast send $USER_ADDRESS \
  --value 0.1ether \
  --private-key $ADMIN_KEY
```

---

## 7. Campaign Operations

Campaigns are **crowdfunding rounds** for new properties.

### 7.1 Business Flow

```
Property Listed → Campaign Created → Users Commit USDC → 
→ Deadline Reached → Admin Finalizes → Tokens Distributed
```

### 7.2 Whitelist TransactionRouter

**Already done in User Lifecycle, but verify**:

```bash
cast call $INDA_ROOT 'whitelist(address)(bool)' $TRANSACTION_ROUTER
```

---

### 7.3 Create Campaign

**What it does**: Deploys a new crowdfunding campaign contract.

**Parameters Explained**:
- `startTime`: When commitments begin accepting
- `commitDeadline`: Last moment to invest
- `executeAfter`: When admin can finalize (must be after deadline)
- `minCap`: Minimum funding required (campaign fails if not reached)
- `maxCap`: Maximum funding accepted
- `feeTiers`: Time-based fee schedule (early birds pay less)

```bash
# Define timing (example: 7-day campaign)
START_TIME=$(date +%s)
COMMIT_DEADLINE=$((START_TIME + 604800))  # +7 days
EXECUTE_AFTER=$((START_TIME + 691200))    # +8 days

# Fee tiers: Early = 0.5%, Middle = 1%, Late = 1.5%
TIER1_END=$((START_TIME + 172800))   # Day 2
TIER2_END=$((START_TIME + 345600))   # Day 4
TIER3_END=$COMMIT_DEADLINE           # Day 7
FEE_TIERS="[($TIER1_END,50),($TIER2_END,100),($TIER3_END,150)]"

# Encode and create
INIT_DATA=$(cast calldata \
  'initialize(address,address,address,uint8,address,uint256,uint256,uint256,uint256,uint256,(uint256,uint16)[])' \
  $INDA_ROOT $USDC $CAMPAIGN_OWNER 1 $TOKEN_ADDRESS \
  $START_TIME $COMMIT_DEADLINE $EXECUTE_AFTER \
  50000000000 200000000000 "$FEE_TIERS")

cast send $COMMIT_FACTORY 'createCampaign(bytes)' $INIT_DATA --private-key $ADMIN_KEY
```

---

### 7.4 Register & Whitelist Campaign

```bash
# Register in Manager (enables discovery)
cast send $MANAGER_CO 'registerCampaign(address)' $CAMPAIGN_ADDR --private-key $ADMIN_KEY

# Whitelist (allows receiving USDC)
cast send $INDA_ROOT '_setToWhitelist(address[],bool[])' "[$CAMPAIGN_ADDR]" "[true]" --private-key $ADMIN_KEY
```

---

### 7.5 User Investment (Commit)

**User Actions** (called by frontend on behalf of user):

```bash
# 1. Approve USDC to Campaign
cast send $USDC 'approve(address,uint256)' $CAMPAIGN_ADDR $AMOUNT --private-key $USER_KEY

# 2. Commit (poolPercentage: 1000 = 10% to pool token)
cast send $CAMPAIGN_ADDR 'commit(uint256,uint256)' $AMOUNT 1000 --private-key $USER_KEY
```

**Pool Percentage Explained**: Users choose what portion goes to the **Pool Token** vs **Individual Token**:
- **Individual Token**: Direct ownership of this specific property
- **Pool Token**: Diversified ownership across ALL properties in the country

---

### 7.6 Campaign Finalization

**When**: After `executeAfter` timestamp AND `minCap` reached.

```bash
# 1. Owner approves funds transfer
cast send $CAMPAIGN_ADDR \
  'approveFunds(address,uint256)' \
  $INDA_ADMIN_ROUTER \
  $TOTAL_COMMITTED \
  --private-key $CAMPAIGN_OWNER_KEY

# 2. Execute finalization
cast send $INDA_ADMIN_ROUTER \
  'finalizeAndDistributeCampaign(address,bytes32,address,address,address)' \
  $CAMPAIGN_ADDR $COUNTRY_CODE $TOKEN_ADDRESS $USDC $INDA_ROOT \
  --private-key $ADMIN_KEY
```

**What happens**:
1. USDC transferred to IndaRoot treasury
2. Property tokens minted proportionally
3. Tokens deposited into investor CMDs
4. Campaign marked as finalized

---

## 8. Post-Campaign Operations

### 8.1 Rent Distribution

**Business Context**: Property managers collect rent from tenants monthly. This rent (minus property management fees) is deposited on-chain for token holders.

```bash
# 1. Admin receives USDC from property manager
# 2. Approve Distributor
cast send $USDC 'approve(address,uint256)' $DISTRIBUTOR_PROXY $RENT_AMOUNT --private-key $ADMIN_KEY

# 3. Deposit rent
cast send $DISTRIBUTOR_PROXY 'depositRent(uint256)' $RENT_AMOUNT --private-key $ADMIN_KEY
```

**For Pool Token holders** (rent from ALL properties in country):

```bash
cast send $POOL_DISTRIBUTOR 'depositRent(uint256)' $POOL_RENT --private-key $ADMIN_KEY
```

### 8.2 User Rent Claim

See **Operation Type 2** in Section 10.

---

## 9. Governance & Buyout Flow

### 9.1 Business Context

**What is a Buyout?** When someone wants to purchase an entire property, they must:
1. Propose a buyout at a price premium
2. Get approval from token holders (democratic vote)
3. Pay all holders their share of the sale price
4. Receive 100% ownership

This protects minority shareholders from forced sales at unfair prices.

### 9.2 Deploy & Configure Governor

**When used**: When preparing a property for potential buyout.

```bash
# Deploy Governor
forge script DeployGovernor.s.sol --broadcast

# Configure permissions
GOVERNANCE_ROLE="0x71840dc4906352362b0cdaf79870196c8e42acafade72d5d5a6d59291253ceb1"
PROPERTIES_MANAGER_ROLE="0x5caba2aa072f9476eef4eba05f22235aef4612b73d339428b33d92eca0aabf20"

# Whitelist Governor
cast send $INDA_ROOT '_setToWhitelist(address[],bool[])' "[$GOVERNOR]" "[true]"

# Grant GOVERNANCE_ROLE
cast send $INDA_ROOT 'grantRole(bytes32,address)' $GOVERNANCE_ROLE $GOVERNOR
cast send $PROPERTY_REGISTRY 'grantRole(bytes32,address)' $GOVERNANCE_ROLE $GOVERNOR

# Grant PROPERTIES_MANAGER_ROLE to Router (for executing buyout)
cast send $INDA_ROOT 'grantRole(bytes32,address)' $PROPERTIES_MANAGER_ROLE $TRANSACTION_ROUTER
```

### 9.3 Create Buyout Proposal

```bash
# Get buyout cost
COST=$(cast call $PROPERTY_REGISTRY 'getBuyoutCost(uint256,address,uint256)(uint256)' \
  $PROPERTY_ID $BUYER_ADDRESS $OFFER_PRICE)

# Buyer approves payment to Governor
cast send $USDC 'approve(address,uint256)' $GOVERNOR $COST --private-key $BUYER_KEY

# Create proposal
cast send $GOVERNOR 'proposePropertyBuyout(address,uint256)' \
  $BUYER_ADDRESS $OFFER_PRICE --private-key $BUYER_KEY
```

### 9.4 Voting → Queue → Execute

```bash
# Vote (after votingDelay)
cast send $GOVERNOR 'castVote(uint256,uint8)' $PROPOSAL_ID 1 --private-key $VOTER_KEY

# Queue (after votingPeriod, if succeeded)
cast send $GOVERNOR 'queueProposal(uint256)' $PROPOSAL_ID

# Execute (after executionDelay)
cast send $GOVERNOR 'executeProposal(uint256)' $PROPOSAL_ID
```

### 9.5 Holder Redemption

**CRITICAL**: Holders must be whitelisted for buyout transfers.

```bash
# Whitelist for buyout
cast send $INDA_ROOT 'whitelistForBuyout(address,address,bool)' $TOKEN $USER_CMD true
cast send $INDA_ROOT 'whitelistForBuyout(address,address,bool)' $TOKEN $ROUTER true

# Redeem tokens
cast send $TRANSACTION_ROUTER 'executeRedeemBuyoutTokens(uint256,uint256,bytes32,address)' \
  $PROPERTY_ID $AMOUNT $COUNTRY_CODE $INDA_ROOT --private-key $USER_KEY
```

---

## 10. Complete Operation Reference

### Understanding Operations

Every user action on Indahouse emits an `OperationRecorded` event. These are the 10 types:

---

### Type 0: P2P_TRANSFER

**Business Purpose**: User transfers tokens to another user (gift, OTC sale settlement).

**When Used**: User-initiated wallet-to-wallet transfer.

**Function**: `TransactionRouter.executeP2PTransfer`

```solidity
function executeP2PTransfer(
    bytes32 senderCountryCode,    // Sender's country
    bytes32 recipientCountryCode, // Recipient's country (can differ)
    address recipient,            // Recipient EOA address
    address underlyingToken,      // Property token address
    uint256 amount                // Number of tokens
) external
```

| Requirement | Details |
|-------------|---------|
| **Caller** | Token sender (msg.sender) |
| **Sender Prerequisites** | Has CMD, has token balance ≥ amount |
| **Recipient Prerequisites** | Has CMD, token initialized in CMD |
| **Approvals Needed** | None |
| **Result** | Tokens move from sender CMD → recipient CMD |

---

### Type 1: DIRECT_PURCHASE

**Business Purpose**: User buys property tokens directly with USDC.

**When Used**: Outside of campaigns, instant purchase at current price.

**Function**: `TransactionRouter.executeDirectPurchase`

```solidity
struct DirectPurchaseData {
    address userEOA;        // Buyer address
    bytes32 countryCode;    // Country for investment
    address individualToken;// Property token
    address poolToken;      // Pool token (optional)
    uint256 usdcAmount;     // USDC to spend
    uint256 poolPercentage; // % going to pool (basis points)
}

function executeDirectPurchase(
    DirectPurchaseData calldata data,
    address indaRootAddress,
    address baseToken
) external returns (uint256 individualBought, uint256 poolBought)
```

| Requirement | Details |
|-------------|---------|
| **Caller** | Buyer (msg.sender = data.userEOA) |
| **Prerequisites** | User whitelisted, has CMD, Router whitelisted |
| **Approvals** | `USDC.approve(ROUTER, amount)` |
| **Result** | USDC → IndaRoot, Tokens minted → User CMD |

---

### Type 2: RENT_CLAIM

**Business Purpose**: User claims accumulated rental income.

**When Used**: User manually claims, or automatic claim on transfer.

**Function**: `TransactionRouter.executeRentClaim`

```solidity
function executeRentClaim(
    bytes32 countryCode,       // User's country
    address distributorAddress,// IndaDistributor or PoolDistributor
    address underlyingToken    // Token used to calculate share
) external returns (uint256 usdcAmount)
```

| Requirement | Details |
|-------------|---------|
| **Caller** | Token holder (msg.sender) |
| **Prerequisites** | User has CMD, has token balance > 0, unclaimed rewards exist |
| **Approvals** | None |
| **Result** | USDC sent directly to user's EOA |

**Example**:
```bash
# Claim from individual property distributor
cast send $ROUTER 'executeRentClaim(bytes32,address,address)' $COUNTRY_CODE $DISTRIBUTOR $TOKEN

# Claim from pool distributor
cast send $ROUTER 'executeRentClaim(bytes32,address,address)' $COUNTRY_CODE $POOL_DISTRIBUTOR $POOL_TOKEN
```

---

### Type 3: PROPERTY_BUYOUT

**Business Purpose**: Major stakeholder acquires 100% of property.

**When Used**: Governor executes approved buyout proposal.

**Function**: `TransactionRouter.executePropertyBuyout`

```solidity
struct BuyoutData {
    address buyerEOA;           // Buyer address
    address buyerCMD;           // Buyer's CMD
    bytes32 countryCode;        // Property country
    uint256 propertyId;         // Property ID in registry
    address individualToken;    // Token address
    uint256 offerPricePerToken; // Price offered per token
}

function executePropertyBuyout(
    BuyoutData calldata data,
    address indaRootAddress,
    address baseToken
) external returns (uint256 tokensAcquired)
```

| Requirement | Details |
|-------------|---------|
| **Caller** | Governor contract or authorized buyer |
| **Prerequisites** | Router has `PROPERTIES_MANAGER_ROLE`, buyer whitelisted |
| **Approvals** | `USDC.approve(ROUTER, buyoutCost)` |
| **Result** | Token enters BUYOUT_MODE, buyer receives all tokens |

---

### Type 4: BUYOUT_REDEMPTION

**Business Purpose**: Holder claims USDC after property buyout.

**When Used**: After buyout executed, holders redeem tokens for USDC.

**Function**: `TransactionRouter.executeRedeemBuyoutTokens`

```solidity
function executeRedeemBuyoutTokens(
    uint256 propertyId,      // Property ID
    uint256 amount,          // Tokens to redeem
    bytes32 countryCode,     // User's country
    address indaRootAddress  // IndaRoot address
) external returns (uint256 usdcAmount)
```

| Requirement | Details |
|-------------|---------|
| **Caller** | Token holder (msg.sender) |
| **Prerequisites** | Property in BUYOUT_MODE, user has tokens, **user CMD whitelisted for buyout**, **router whitelisted for buyout** |
| **Approvals** | None (tokens pulled via CMD.sendTokens) |
| **Result** | Tokens burned → USDC sent to user EOA |

**Critical Whitelisting**:
```bash
cast send $INDA_ROOT 'whitelistForBuyout(address,address,bool)' $TOKEN $USER_CMD true
cast send $INDA_ROOT 'whitelistForBuyout(address,address,bool)' $TOKEN $ROUTER true
```

---

### Type 5: VAULT_SALE

**Business Purpose**: User sells tokens to PoolVault for instant liquidity.

**When Used**: User wants to exit position without finding a buyer.

**Function**: `TransactionRouter.executeSellTokensToVault`

```solidity
function executeSellTokensToVault(
    address individualToken, // Token to sell
    uint256 amount,          // Amount to sell
    bytes32 countryCode      // User's country
) external returns (uint256 usdcReceived)
```

| Requirement | Details |
|-------------|---------|
| **Caller** | Token holder (msg.sender) |
| **Prerequisites** | User has token balance, Vault has USDC liquidity |
| **Approvals** | None |
| **Result** | Tokens → Vault, USDC → User |

---

### Type 6: VAULT_CLAIM

**Business Purpose**: Trigger PoolVault to claim and redistribute rent.

**When Used**: Periodic maintenance by admin/automated job.

**Function**: `TransactionRouter.executePoolVaultClaimAll`

```solidity
function executePoolVaultClaimAll(bytes32 countryCode) external
```

| Requirement | Details |
|-------------|---------|
| **Caller** | Anyone (usually automated) |
| **Prerequisites** | Vault has accumulated rewards |
| **Result** | Vault claims from distributors, redistributes to pool holders |

---

### Type 7: P2P_SALE

**Business Purpose**: Peer-to-peer marketplace sale between users.

**When Used**: User lists tokens for sale, buyer purchases.

**Function**: `TransactionRouter.executeP2PSale`

```solidity
struct P2PSaleData {
    address sellerEOA;       // Seller address
    address sellerCMD;       // Seller CMD
    address buyerEOA;        // Buyer address
    address buyerCMD;        // Buyer CMD
    address token;           // Token being sold
    uint256 amount;          // Token amount
    uint256 totalSalePrice;  // USDC price
    bytes32 countryCode;     // Country
}

function executeP2PSale(P2PSaleData calldata data) external
```

| Requirement | Details |
|-------------|---------|
| **Caller** | Buyer (msg.sender = data.buyerEOA) |
| **Prerequisites** | Seller has tokens, buyer has USDC, token initialized in buyer CMD |
| **Approvals** | 1. `USDC.approve(ROUTER, price)` by buyer<br>2. `sellerCMD.approveToken(token, ROUTER, amount)` by seller |
| **Result** | USDC → Seller (minus fee), Tokens → Buyer CMD |

---

### Type 8 & 9: MARKETPLACE_SALE / MARKETPLACE_PURCHASE

**Business Purpose**: Platform-facilitated marketplace transactions.

**When Used**: Backend orchestrates trades from order book.

**Function**: `TransactionRouter.executeMarketplaceSale` (Admin only)

```solidity
function executeMarketplaceSale(
    bytes32 sellerCountryCode,
    bytes32 buyerCountryCode,
    address seller,
    address buyer,
    address underlyingToken,
    uint256 amount,
    uint256 price,
    address paymentToken
) external onlyAdmin
```

| Requirement | Details |
|-------------|---------|
| **Caller** | Admin ONLY |
| **Prerequisites** | Both have CMDs, buyer has payment balance, seller has tokens |
| **Approvals** | `paymentToken.approve(ROUTER, price)` by buyer |

---

## 11. Database Schema

### Countries
```sql
CREATE TABLE countries (
    code VARCHAR(2) PRIMARY KEY,
    name VARCHAR(100),
    manager_address VARCHAR(42),
    pool_token_address VARCHAR(42),
    pool_vault_address VARCHAR(42),
    pool_distributor_address VARCHAR(42),
    currency VARCHAR(3) DEFAULT 'USD'
);
```

### Users & CMDs
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    wallet_address VARCHAR(42) UNIQUE,
    kyc_status ENUM('PENDING','VERIFIED','REJECTED')
);

CREATE TABLE user_country_profiles (
    user_id UUID REFERENCES users(id),
    country_code VARCHAR(2) REFERENCES countries(code),
    cmd_address VARCHAR(42) NOT NULL,
    whitelist_status BOOLEAN DEFAULT FALSE,
    loyalty_level ENUM('BRONZE','SILVER','GOLD') DEFAULT 'BRONZE',
    PRIMARY KEY (user_id, country_code)
);
```

### Properties
```sql
CREATE TABLE properties (
    id INTEGER PRIMARY KEY,
    country_code VARCHAR(2),
    token_address VARCHAR(42) UNIQUE,
    distributor_address VARCHAR(42),
    name VARCHAR(255),
    symbol VARCHAR(20),
    price_per_token DECIMAL(18,6),
    status ENUM('PRESALE','ACTIVE','BUYOUT_PENDING','RETIRED'),
    governor_address VARCHAR(42)
);
```

### Operations (Indexed from Subgraph)
```sql
CREATE TABLE operations (
    id SERIAL PRIMARY KEY,
    operation_id INTEGER,
    user_address VARCHAR(42),
    op_type INTEGER CHECK (op_type BETWEEN 0 AND 9),
    underlying_token VARCHAR(42),
    amount DECIMAL(36,18),
    block_number INTEGER,
    tx_hash VARCHAR(66),
    timestamp TIMESTAMP,
    UNIQUE (block_number, tx_hash, operation_id)
);
```

---

## 12. Subgraph & Accounting Reports

### 12.1 Query User Statement

```graphql
query UserStatement($user: Bytes!, $start: BigInt!, $end: BigInt!) {
  operations(
    where: { user: $user, blockTimestamp_gte: $start, blockTimestamp_lte: $end }
    orderBy: blockTimestamp
  ) {
    operationId
    opType
    amount
    underlyingToken
    transactionHash
    blockTimestamp
  }
}
```

### 12.2 Operation Labels for Extractos

| opType | Spanish | English | Category |
|--------|---------|---------|----------|
| 0 | Transferencia P2P | P2P Transfer | Movement |
| 1 | Inversión Directa | Direct Investment | Credit |
| 2 | Cobro de Renta | Rent Claim | Income |
| 3 | Compra Propiedad | Property Buyout | Acquisition |
| 4 | Redención Buyout | Buyout Redemption | Liquidation |
| 5 | Venta a Bóveda | Vault Sale | Exit |
| 6 | Cobro Bóveda | Vault Claim | Dividend |
| 7 | Venta P2P | P2P Sale | Proceeds |
| 8 | Venta Marketplace | Marketplace Sale | Proceeds |
| 9 | Compra Marketplace | Marketplace Purchase | Credit |

---

**End of Document**
