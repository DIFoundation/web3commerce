web3-marketplace/
├── frontend/                         # Next.js 16 App (Frontend + API)
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │
│   │   ├── (shop)/
│   │   │   ├── page.tsx                     # Homepage / marketplace
│   │   │   ├── product/[id]/page.tsx
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   ├── order/page.tsx
│   │   │   └── layout.tsx
│   │
│   │   ├── (seller)/
│   │   │   ├── apply/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── layout.tsx
│   │
│   │   ├── admin/                  # Optional but powerful
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── sellers/page.tsx
│   │   │   ├── products/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── layout.tsx
│   │
│   │   ├── api/                      # Backend lives here
│   │   │   ├── auth/route.ts
│   │   │   ├── users/route.ts
│   │   │
│   │   │   ├── sellers/
│   │   │   │   ├── apply/route.ts
│   │   │   │   ├── approve/route.ts
│   │   │   │   └── route.ts
│   │   │
│   │   │   ├── products/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── upload/route.ts     # handles Pinata upload
│   │   │
│   │   │   ├── orders/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── fulfill/route.ts
│   │   │
│   │   │   ├── reviews/route.ts
│   │   │
│   │   │   ├── ipfs/route.ts           # reusable IPFS helper endpoint
│   │   │
│   │   │   └── webhook/
│   │   │       └── payment/route.ts
│   │
│   │   ├── layout.tsx
│   │   ├── providers.tsx
│   │   └── globals.css
│
│   ├── components/
│   │   ├── auth/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── seller/
│   │   ├── admin/
│   │   ├── review/
│   │   └── shared/
│
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useOrders.ts
│   │   ├── useSeller.ts
│   │   ├── useReviews.ts
│   │   ├── useContract.ts
│   │   └── useIPFS.ts
│
│   ├── lib/
│   │   ├── privy.ts              # wallet + social auth
│   │   ├── wagmi.ts              # blockchain config
│   │   ├── supabase.ts           # DB client
│   │   ├── pinata.ts             # IPFS upload logic
│   │   ├── contracts.ts          # ABI + address
│   │   ├── roles.ts              # RBAC logic
│   │   └── utils.ts
│
│   ├── store/
│   │   ├── cartStore.ts
│   │   └── userStore.ts
│
│   ├── types/
│   │   └── index.ts
│
│   ├── public/
│   ├── .env.local
│   ├── next.config.js
│   └── tailwind.config.ts
│
├── contracts/                     # Foundry Smart Contracts
│   ├── src/
│   │   ├── Marketplace.sol       # core marketplace logic
│   │   ├── Escrow.sol            # trustless payment handling
│   │   ├── LoyaltyNFT.sol        # optional reward system
│   │
│   ├── test/
│   │   ├── Marketplace.t.sol
│   │   ├── Escrow.t.sol
│   │
│   ├── script/
│   │   ├── Deploy.s.sol
│   │   ├── DeployAndVerify.s.sol
│   │
│   ├── lib/
│   ├── foundry.toml
│   └── .env
│
├── README.md