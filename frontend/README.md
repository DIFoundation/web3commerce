# 🛍️ Web3 Marketplace Frontend

A decentralized multi-vendor e-commerce platform built with **Next.js 16**, enabling users to buy and sell products using crypto with a seamless Web3 experience.

---

## 🚀 Features

* 🔐 Authentication via Privy (Wallet + Social Login)
* 🏪 Multi-vendor marketplace (Seller onboarding & dashboard)
* 🛒 Shopping cart & checkout system
* 💰 Crypto payments with escrow integration
* 📦 Product storage using IPFS (Pinata)
* 📊 Order tracking for buyers & sellers
* 🛡️ Role-based access (Buyer, Seller, Admin)

---

## 🧱 Tech Stack

* **Framework:** Next.js 16 (App Router)
* **Styling:** Tailwind CSS
* **State Management:** Zustand
* **Web3:** Wagmi + Viem
* **Auth:** Privy
* **Storage:** IPFS (Pinata)
* **Database:** Supabase
* **API:** Next.js Route Handlers

---

## 📂 Project Structure

```
app/                # Pages & routes
components/         # UI components
hooks/              # Custom React hooks
lib/                # Config & utilities
store/              # Zustand state
types/              # TypeScript types
api/                # Backend routes
```

---

## ⚙️ Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_RPC_URL=
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_PRIVY_APP_ID=

PINATA_API_KEY=
PINATA_SECRET_API_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 🧪 Getting Started

### 1. Install dependencies

```
pnpm install
```

### 2. Run development server

```
pnpm dev
```

App runs on:

```
http://localhost:3000
```

---

## 🔗 Key Integrations

### 🔐 Privy (Auth)

Handles:

* Wallet connection
* Social login
* User session

---

### 🌐 IPFS (Pinata)

Used for:

* Product images
* Product metadata

---

### 🧾 Supabase

Stores:

* Users
* Sellers
* Products
* Orders

---

### 💰 Smart Contracts

Interacts with:

* Marketplace contract
* Escrow contract

---

## 🔄 Core User Flows

### 🏪 Seller

1. Login
2. Apply as seller
3. Upload product (IPFS)
4. Manage listings & orders

---

### 🛒 Buyer

1. Browse products
2. Add to cart
3. Checkout with crypto
4. Track orders

---

### 💸 Payment Flow

1. Buyer pays → funds locked in escrow
2. Seller fulfills order
3. Buyer confirms → funds released

---

## 📌 Notes

* Keep UI simple for hackathon speed
* Core flow: **List → Buy → Escrow → Release**

---

## 🏁 Deployment

Recommended:

* **Vercel** (Frontend)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first.

---

## 📄 License

MIT
