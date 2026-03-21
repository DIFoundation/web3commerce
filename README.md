# 🛍️ Web3Commerce - Decentralized Multi-Vendor E-Commerce

A **decentralized multi-vendor marketplace** where anyone can become a seller, list products, and receive payments in crypto through a **trustless escrow system**.

Built for hackathons with a focus on:

* ⚡ Simplicity
* 🔐 Trustless transactions
* 🌐 Web3-native user experience

---

## 🚀 Overview

This project combines a modern Web2-like shopping experience with Web3 infrastructure:

* Buyers can browse, purchase, and track orders
* Sellers can apply, list products, and manage orders
* Payments are handled via **smart contract escrow**
* Product data is stored on **IPFS (Pinata)**
* Authentication is powered by **wallet + social login**

---

## 🧱 Architecture

```id="arch1"
Frontend (Next.js)  →  API Routes  →  Supabase (DB)
        ↓
   Wagmi / Privy
        ↓
 Smart Contracts (Escrow + Marketplace)
        ↓
        IPFS (Pinata)
```

---

## ✨ Key Features

### 🏪 Multi-Vendor Marketplace

* Anyone can apply as a seller
* Sellers can list and manage products
* Buyers can purchase from multiple vendors

---

### 💰 Trustless Escrow Payments

* Buyer funds are locked in a smart contract
* Seller fulfills the order
* Buyer confirms delivery
* Funds are released securely

---

### 🌐 Decentralized Storage (IPFS)

* Product images stored on IPFS via Pinata
* Metadata stored off-chain but verifiable

---

### 🔐 Seamless Authentication

* Wallet login
* Social login (via Privy)
* No complex onboarding

---

### 📦 Order Management

* Buyers track purchases
* Sellers manage fulfillment
* Transparent transaction flow

---

## 🧪 Tech Stack

### Frontend

* Next.js 16 (App Router)
* Tailwind CSS
* Zustand
* Wagmi + Viem

### Backend (Built into Frontend)

* Next.js API Routes

### Smart Contracts

* Solidity
* Foundry

### Infrastructure

* IPFS (Pinata)
* Supabase (Database)
* Privy (Auth)

---

## 📂 Project Structure

```id="arch2"
web3commerce/
├── frontend/     # Next.js app (UI + API)
├── contracts/    # Smart contracts (Foundry)
└── README.md
```

---

## 🔄 How It Works

### 🏪 Seller Flow

1. User logs in (wallet/social)
2. Applies as a seller
3. Uploads product (stored on IPFS)
4. Product listed in marketplace

---

### 🛒 Buyer Flow

1. Browse products
2. Add to cart
3. Checkout with crypto
4. Funds locked in escrow

---

### 🔓 Payment Flow

1. Buyer pays → Escrow contract holds funds
2. Seller fulfills order
3. Buyer confirms delivery
4. Funds released to seller

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```id="clone"
git clone https://github.com/DIFoundation/web3commerce.git
cd web3commerce
```

---

## 🖥️ Frontend Setup

```id="frontend-setup"
cd frontend
pnpm install
pnpm dev
```

Create `.env.local`:

```id="env1"
NEXT_PUBLIC_RPC_URL=
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_PRIVY_APP_ID=

PINATA_API_KEY=
PINATA_SECRET_API_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 🔗 Smart Contracts Setup

```id="contracts-setup"
cd contracts
forge install
forge build
forge test
```

Create `.env`:

```id="env2"
PRIVATE_KEY=
RPC_URL=
ETHERSCAN_API_KEY=
```

---

### 🚀 Deploy Contracts

```id="deploy"
forge script script/Deploy.s.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

After deployment:

* Copy contract address
* Add to frontend `.env.local`

---

## 🌍 Deployment

* Frontend: Vercel
* Contracts: Testnet (Base / Ethereum / etc.)
* Database: Supabase
* IPFS: Pinata

---

## 🎯 What Makes This Project Stand Out

* 🔥 Trustless escrow (no middleman risk)
* 🌐 Fully Web3-integrated commerce
* ⚡ Fast onboarding (wallet + social login)
* 🏪 Real marketplace (not just a demo store)
* 🧱 Clean, scalable architecture

---

## ⚠️ Future Improvements

* Dispute resolution system
* On-chain product registry
* Reputation system for sellers
* DAO-based marketplace governance

---

## 🤝 Contribution

Contributions are welcome. Feel free to fork and improve.

---

## 📄 License

MIT

---

## 🏁 Final Note

This project demonstrates how traditional e-commerce can evolve into a **trustless, decentralized marketplace**, combining usability with blockchain security.

> Built for innovation. Designed for scale.
