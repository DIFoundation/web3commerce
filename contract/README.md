# 🔗 Web3 Marketplace Smart Contracts

This directory contains the **smart contracts** powering the decentralized multi-vendor marketplace, built using **Foundry**.

---

## 🚀 Features

* 🏪 Multi-vendor product listing
* 💰 Escrow-based payments (trustless transactions)
* 🔐 Secure fund handling
* 📦 Order lifecycle management
* 🎁 Optional NFT-based rewards system

---

## 🧱 Tech Stack

* **Framework:** Foundry
* **Language:** Solidity
* **Testing:** Forge
* **Deployment:** Forge Scripts

---

## 📂 Project Structure

```
src/
├── Marketplace.sol     # Core marketplace logic
├── Escrow.sol          # Payment escrow system
├── LoyaltyNFT.sol      # Optional rewards contract

test/
├── Marketplace.t.sol
├── Escrow.t.sol

script/
├── Deploy.s.sol
├── DeployAndVerify.s.sol
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```
PRIVATE_KEY=
RPC_URL=
ETHERSCAN_API_KEY=
```

---

## 🧪 Commands

### Install dependencies

```
forge install
```

### Compile contracts

```
forge build
```

### Run tests

```
forge test
```

### Format code

```
forge fmt
```

---

## 🚀 Deployment

### Deploy locally

```
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast
```

### Deploy to testnet

```
forge script script/Deploy.s.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

---

## 🧠 Core Contracts

### 📌 Marketplace.sol

Handles:

* Product creation
* Seller registration
* Order creation

---

### 🔒 Escrow.sol

Handles:

* Locking buyer funds
* Releasing funds after confirmation
* Refund logic (if needed)

---

### 🎁 LoyaltyNFT.sol (Optional)

* Rewards buyers with NFTs
* Can be used for discounts or perks

---

## 🔄 Payment Flow

1. Buyer initiates purchase
2. Funds sent to Escrow contract
3. Seller fulfills order
4. Buyer confirms
5. Funds released to seller

---

## 🛡️ Security Considerations

* Validate seller ownership
* Prevent reentrancy attacks
* Use checks-effects-interactions pattern
* Handle failed transactions properly

---

## 🧪 Testing Strategy

* Unit tests for all contract functions
* Edge cases (refunds, failed payments)
* Gas optimization checks

---

## 📌 Notes

* Keep contract logic minimal and secure
* Avoid storing unnecessary data on-chain
* Use backend (Supabase) for heavy data

---

## 🤝 Contributing

Ensure all changes are tested before submitting PRs.

---

## 📄 License

MIT
