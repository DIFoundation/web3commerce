import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei } from "viem";

describe("Marketplace", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContract() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, thirdAccount] = await hre.viem.getWalletClients();

    const escrow = await hre.viem.deployContract("Escrow" as any);
    const marketplace = await hre.viem.deployContract("Marketplace" as any, [escrow.address]);

    await escrow.write.setMarketplace([marketplace.address]);

    const publicClient = await hre.viem.getPublicClient();

    return {
      escrow,
      marketplace,
      owner,
      otherAccount,
      thirdAccount,
      publicClient,
    };
  }

  describe("Seller Registration", function () {
    it("Should register new seller", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
      
      const sellerInfo = await marketplace.read.sellers([owner.account.address]) as any;
      expect(sellerInfo[1]).to.equal("Test Store");
      expect(sellerInfo[2]).to.equal("Test Description");
      expect(sellerInfo[3]).to.equal(true);
    });

    it("Should not allow duplicate seller registration", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Register seller first time
      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
      
      // Try to register again - should fail
      await expect(
        marketplace.write.registerSeller(["Another Store", "Another Description"], {
          account: owner.account
        })
      ).to.be.rejected;
    });

    it("Should allow multiple sellers", async function () {
      const { escrow, marketplace, owner, otherAccount, thirdAccount, publicClient } = await loadFixture(deployContract);

      // Register first seller
      await marketplace.write.registerSeller(["Store 1", "Description 1"], {
        account: owner.account
      });
      
      // Register second seller
      await marketplace.write.registerSeller(["Store 2", "Description 2"], {
        account: otherAccount.account
      });
      
      // Register third seller
      await marketplace.write.registerSeller(["Store 3", "Description 3"], {
        account: thirdAccount.account
      });
      
      expect(await marketplace.read.isSeller([owner.account.address])).to.equal(true);
      expect(await marketplace.read.isSeller([otherAccount.account.address])).to.equal(true);
      expect(await marketplace.read.isSeller([thirdAccount.account.address])).to.equal(true);
    });
  });

  describe("Product Management", function () {
    beforeEach(async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);
      
      // Register a seller for product tests
      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
    });

    it("Should create product", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Register seller first
      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
      
      const productPrice = parseGwei("1000000000"); // 1 ETH
      await marketplace.write.createProduct([
        "Test Product",
        "Test Description",
        productPrice,
        10n, // stock
        "QmTest123" // IPFS hash
      ], {
        account: owner.account
      });
      
      const productId = 1n;
      
      const product = await marketplace.read.products([productId]) as any;

      expect(product[1].toLowerCase()).to.equal(owner.account.address.toLowerCase());
      expect(product[2]).to.equal("Test Product");
      expect(product[3]).to.equal("Test Description");
      expect(product[4]).to.equal(productPrice);
      expect(product[5]).to.equal(10n);
      expect(product[6]).to.equal("QmTest123");
      expect(product[7]).to.equal(true);
    });

    it("Should not allow non-sellers to create products", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      const productPrice = parseGwei("1000000000");
      
      await expect(
        marketplace.write.createProduct([
          "Test Product",
          "Test Description", 
          productPrice,
          10n,
          "QmTest123"
        ], {
          account: otherAccount.account // Not registered as seller
        })
      ).to.be.rejected;
    });

    it("Should update product", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Register seller and create product
      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
      
      await marketplace.write.createProduct([
        "Test Product",
        "Test Description",
        parseGwei("1000000000"),
        10n,
        "QmTest123"
      ], {
        account: owner.account
      });
      
      // Update product
      const productId = 1n;
      const newPrice = parseGwei("2000000000"); // 2 ETH
      const newStock = 5n;
      
      await marketplace.write.updateProduct([
        productId,
        newPrice,
        newStock,
        true // keep active
      ], {
        account: owner.account
      });
      
      const product = await marketplace.read.products([productId]) as any;

      expect(product[4]).to.equal(newPrice);
      expect(product[5]).to.equal(newStock);
    });

    it("Should not allow non-owners to update products", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Register seller and create product
      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
      
      const productId = await marketplace.write.createProduct([
        "Test Product",
        "Test Description",
        parseGwei("1000000000"),
        10n,
        "QmTest123"
      ], {
        account: owner.account
      });
      
      // Try to update with different account
      await expect(
        marketplace.write.updateProduct([
          productId,
          parseGwei("2000000000"),
          5n,
          true
        ], {
          account: otherAccount.account
        })
      ).to.be.rejected;
    });

    it("Should remove product", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Register seller and create product
      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
      
      await marketplace.write.createProduct([
        "Test Product",
        "Test Description",
        parseGwei("1000000000"),
        10n,
        "QmTest123"
      ], {
        account: owner.account
      });

      const productId = 1n;
      
      // Remove product
      await marketplace.write.removeProduct([productId], {
        account: owner.account
      });
      
      const product = await marketplace.read.products([productId]) as any;
      expect(product[7]).to.be.equal(false);
    });
  });

  describe("Order Creation", function () {
    beforeEach(async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);
      
      // Setup: register seller and create product
      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
      
      await marketplace.write.createProduct([
        "Test Product",
        "Test Description",
        parseGwei("1000000000"), // 1 ETH
        10n, // stock
        "QmTest123"
      ], {
        account: owner.account
      });
    });

    it("Should create order and escrow", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Setup
      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
      
      await marketplace.write.createProduct([
        "Test Product",
        "Test Description",
        parseGwei("1000000000"),
        10n,
        "QmTest123"
      ], {
        account: owner.account
      });
      
      // Create order
      const productId = 1n;
      const productPrice = parseGwei("1000000000");
      const result = await marketplace.write.createOrder([
        productId,
        1n, // quantity
        "123 Test Street" // shipping address
      ], {
        value: productPrice,
        account: otherAccount.account
      });
      
      // Check order was created
      const order = await marketplace.read.orders([1n]) as any;
      expect(order[0]).to.equal(productId);
      expect(order[2].toLowerCase()).to.equal(otherAccount.account.address.toLowerCase());
      expect(order[3].toLowerCase()).to.equal(owner.account.address.toLowerCase());
      expect(order[4]).to.equal(1n);
      expect(order[5]).to.equal(productPrice);
      expect(order[7]).to.equal(1); // PAID = 1
      
      // Check escrow was created
      const escrowDetails = await escrow.read.getEscrow([1n]) as any;
      expect(escrowDetails.buyer.toLowerCase()).to.equal(otherAccount.account.address.toLowerCase());
      expect(escrowDetails.seller.toLowerCase()).to.equal(owner.account.address.toLowerCase());
      expect(escrowDetails.amount).to.equal(productPrice);
      expect(escrowDetails.productId).to.equal(productId);
      
      // Check product stock was reduced
      const product = await marketplace.read.products([productId]) as any;
      expect(product[5]).to.equal(9n); // 10 - 1
    });

    it("Should not allow buying own product", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Setup
      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
      
      const productId = await marketplace.write.createProduct([
        "Test Product",
        "Test Description",
        parseGwei("1000000000"),
        10n,
        "QmTest123"
      ], {
        account: owner.account
      });
      
      // Try to buy own product
      await expect(
        marketplace.write.createOrder([
          productId,
          1n,
          "123 Test Street"
        ], {
          value: parseGwei("1000000000"),
          account: owner.account // Same account as seller
        })
      ).to.be.rejected;
    });

    it("Should require exact payment amount", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Setup
      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
      
      const productId = await marketplace.write.createProduct([
        "Test Product",
        "Test Description",
        parseGwei("1000000000"),
        10n,
        "QmTest123"
      ], {
        account: owner.account
      });
      
      // Try to pay wrong amount
      await expect(
        marketplace.write.createOrder([
          productId,
          1n,
          "123 Test Street"
        ], {
          value: parseGwei("2000000000"), // Too much
          account: otherAccount.account
        })
      ).to.be.rejected;
    });

    it("Should not allow buying inactive products", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Setup
      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
      
      await marketplace.write.createProduct([
        "Test Product",
        "Test Description",
        parseGwei("1000000000"),
        10n,
        "QmTest123"
      ], {
        account: owner.account
      });

      const productId = 1n;
      
      // Deactivate product
      await marketplace.write.updateProduct([
        productId,
        parseGwei("1000000000"),
        10n,
        false // inactive
      ], {
        account: owner.account
      });
      
      // Try to buy inactive product
      await expect(
        marketplace.write.createOrder([
          productId,
          1n,
          "123 Test Street"
        ], {
          value: parseGwei("1000000000"),
          account: otherAccount.account
        })
      ).to.be.rejected;
    });
  });

  describe("Order Management", function () {
    beforeEach(async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);
      
      // Setup complete scenario
      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
      
      await marketplace.write.createProduct([
        "Test Product",
        "Test Description",
        parseGwei("1000000000"),
        10n,
        "QmTest123"
      ], {
        account: owner.account
      });

      const productId = 1n;
      
      await marketplace.write.createOrder([
        productId,
        1n,
        "123 Test Street"
      ], {
        value: parseGwei("1000000000"),
        account: otherAccount.account
      });
    });

    it("Should fulfill order", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Setup
      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
      
      await marketplace.write.createProduct([
        "Test Product",
        "Test Description",
        parseGwei("1000000000"),
        10n,
        "QmTest123"
      ], {
        account: owner.account
      });

      const productId = 1n;
      
      await marketplace.write.createOrder([
        productId,
        1n,
        "123 Test Street"
      ], {
        value: parseGwei("1000000000"),
        account: otherAccount.account
      });
      
      // Fulfill order
      await marketplace.write.fulfillOrder([1n], {
        account: owner.account
      });
      
      const order = await marketplace.read.orders([1n]) as any;
      console.log('ooooooooooooooooooooooooo', order);
      expect(order.status).to.equal(3n); // FULFILLED = 3
    });

    it("Should complete order", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Setup
      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
      
      await marketplace.write.createProduct([
        "Test Product",
        "Test Description",
        parseGwei("1000000000"),
        10n,
        "QmTest123"
      ], {
        account: owner.account
      });

      const productId = 1n;
      
      await marketplace.write.createOrder([
        productId,
        1n,
        "123 Test Street"
      ], {
        value: parseGwei("1000000000"),
        account: otherAccount.account
      });
      
      // Fulfill and complete order
      await marketplace.write.fulfillOrder([1n], {
        account: owner.account
      });
      
      await marketplace.write.completeOrder([1n], {
        account: otherAccount.account
      });
      
      const order = await marketplace.read.orders([1n]) as any;
      expect(order.status).to.equal(4n); // COMPLETED = 4
    });

    it("Should cancel order", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Setup
      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
      
      await marketplace.write.createProduct([
        "Test Product",
        "Test Description",
        parseGwei("1000000000"),
        10n,
        "QmTest123"
      ], {
        account: owner.account
      });

      const productId = 1n;
      
      await marketplace.write.createOrder([
        productId,
        1n,
        "123 Test Street"
      ], {
        value: parseGwei("1000000000"),
        account: otherAccount.account
      });
      
      // Cancel order
      await marketplace.write.cancelOrder([1n], {
        account: owner.account
      });
      
      const order = await marketplace.read.orders([1n]) as any;
      expect(order.status).to.equal(5n); // CANCELLED = 5
      
      // Check product stock was restored
      const product = await marketplace.read.products([productId]) as any;
      expect(product.stock).to.equal(10n); // Restored to original
    });
  });

  describe("View Functions", function () {
    it("Should return seller products", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Setup
      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
      
      // Create multiple products
      await marketplace.write.createProduct([
        "Product 1",
        "Description 1",
        parseGwei("1000000000"),
        10n,
        "QmTest123"
      ], {
        account: owner.account
      });
      
      await marketplace.write.createProduct([
        "Product 2",
        "Description 2",
        parseGwei("2000000000"),
        5n,
        "QmTest456"
      ], {
        account: owner.account
      });
      
      const productId1 = 1n;
      const productId2 = 2n;
      
      const sellerProducts = await marketplace.read.getSellerProducts([owner.account.address]) as any;
      expect(sellerProducts).to.have.lengthOf(2);
      expect(sellerProducts[0]).to.equal(productId1);
      expect(sellerProducts[1]).to.equal(productId2);
    });

    it("Should return buyer orders", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Setup
      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
      
      await marketplace.write.createProduct([
        "Test Product",
        "Test Description",
        parseGwei("1000000000"),
        10n,
        "QmTest123"
      ], {
        account: owner.account
      });

      const productId = 1n;
      
      // Create multiple orders
      await marketplace.write.createOrder([
        productId,
        1n,
        "Address 1"
      ], {
        value: parseGwei("1000000000"),
        account: otherAccount.account
      });
      
      await marketplace.write.createOrder([
        productId,
        1n,
        "Address 2"
      ], {
        value: parseGwei("1000000000"),
        account: otherAccount.account
      });
      
      const buyerOrders = await marketplace.read.getBuyerOrders([otherAccount.account.address]) as any;
      expect(buyerOrders).to.have.lengthOf(2);
      expect(buyerOrders[0]).to.equal(1n);
      expect(buyerOrders[1]).to.equal(2n);
    });

    it("Should return seller orders", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Setup
      await marketplace.write.registerSeller(["Test Store", "Test Description"], {
        account: owner.account
      });
      
      await marketplace.write.createProduct([
        "Test Product",
        "Test Description",
        parseGwei("1000000000"),
        10n,
        "QmTest123"
      ], {
        account: owner.account
      });

      const productId = 1n;
      
      // Create order
      await marketplace.write.createOrder([
        productId,
        1n,
        "123 Test Street"
      ], {
        value: parseGwei("1000000000"),
        account: otherAccount.account
      });
      
      const sellerOrders = await marketplace.read.getSellerOrders([owner.account.address]) as any;
      expect(sellerOrders).to.have.lengthOf(1);
      expect(sellerOrders[0]).to.equal(1n);
    });
  });
});
