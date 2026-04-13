import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { Address, getAddress, parseGwei } from "viem";

describe("Escrow", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContract() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const escrow = await hre.viem.deployContract("Escrow" as any);
    const marketplace = await hre.viem.deployContract("Marketplace" as any, [escrow.address]);

    await escrow.write.setMarketplace([marketplace.address]);

    const publicClient = await hre.viem.getPublicClient();

    return {
      escrow,
      marketplace,
      owner,
      otherAccount,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("Should register new seller", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      await marketplace.write.registerSeller(["Test Store", "Test Description"]);
      expect(await marketplace.read.isSeller([owner.account.address])).to.equal(true);
    });
  });

  describe("Escrow Creation", function () {
    it("Should create escrow through marketplace order", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Register seller
      await marketplace.write.registerSeller(["Test Store", "Test Description"]), {
        account: owner
      };
      
      // Create product
      const productPrice = parseGwei("1000000000"); // 1 ETH
      await marketplace.write.createProduct([
        "Test Product",
        "Test Description",
        productPrice,
        10n, // stock
        "QmTest123" // IPFS hash
      ]);

      
      // Create order (which creates escrow)
      const orderAmount = productPrice; // 1 ETH for 1 item
      const result = await marketplace.write.createOrder([
        1,
        1n, // quantity
        "123 Test Street" // shipping address
      ], {
        value: orderAmount,
        account: otherAccount.account,
      });

      // Get escrow details to verify creation
      const productId = 1n;
      const escrowId = 1n; // First escrow should have ID 1
      const escrowDetails = await escrow.read.getEscrow([escrowId]);
      
      expect(escrowDetails.buyer.toLowerCase()).to.equal(otherAccount.account.address.toLowerCase());
      expect(escrowDetails.seller.toLowerCase()).to.equal(owner.account.address.toLowerCase());
      expect(escrowDetails.amount).to.equal(orderAmount);
      expect(escrowDetails.productId).to.equal(productId);
    });
  });

  describe("Escrow Operations", function () {
    it("Should release payment to seller", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Register seller and create product
      await marketplace.write.registerSeller(["Test Store", "Test Description"]), {
        account: owner.account
      };

      const productPrice = parseGwei("1000000000"); // 1 ETH
      await marketplace.write.createProduct([
        "Test Product",
        "Test Description",
        productPrice,
        10n,
        "QmTest123"
      ]), {
        account: owner.account
      };

      const productId = 1n;
      
      // Create order (which creates escrow)
      await marketplace.write.createOrder([
        productId,
        1n,
        "123 Test Street"
      ], {
        value: productPrice,
        account: otherAccount.account
      });
      
      // Check seller balance before release
      const sellerBalanceBefore = await publicClient.getBalance({
        address: owner.account.address
      }) as any;
      
      // Release payment (buyer calls this)
      await escrow.write.releasePayment([1n]), {
        account: otherAccount.account
      };
      
      // Check seller balance after release
      const sellerBalanceAfter = await publicClient.getBalance({
        address: owner.account.address
      });
      
      // Seller should receive the escrow amount (minus gas fees)
      expect(sellerBalanceAfter).to.be.greaterThan(sellerBalanceBefore);
      
      // Check escrow status
      const escrowDetails = await escrow.read.getEscrow([1n]) as any;
      expect(escrowDetails.status).to.equal(2n); // RELEASED = 2
    });

    it("Should release payment to seller", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Create escrow
      const escrowAmount = parseGwei("1000000000");
      const productId = 1n;
      
      await escrow.write.createEscrow([
        otherAccount.account.address,
        owner.account.address,
        productId
      ], {
        value: escrowAmount
      });
      
      // Check seller balance before release
      const sellerBalanceBefore = await publicClient.getBalance({
        address: owner.account.address
      });
      
      // Release payment (buyer calls this)
      await escrow.write.releasePayment([1n]);
      
      // Check seller balance after release
      const sellerBalanceAfter = await publicClient.getBalance({
        address: owner.account.address
      });
      
      // Seller should receive the escrow amount (minus gas fees)
      expect(sellerBalanceAfter).to.be.greaterThan(sellerBalanceBefore);
      
      // Check escrow status
      const escrowDetails = await escrow.read.getEscrow([1n]);
      expect(escrowDetails.status).to.equal(2n); // RELEASED = 2
    });

    it("Should refund buyer", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Create escrow
      const escrowAmount = parseGwei("1000000000");
      const productId = 1n;
      
      await escrow.write.createEscrow([
        otherAccount.account.address,
        owner.account.address,
        productId
      ], {
        value: escrowAmount
      });
      
      // Check buyer balance before refund
      const buyerBalanceBefore = await publicClient.getBalance({
        address: otherAccount.account.address
      });
      
      // Refund (seller calls this)
      await escrow.write.refund([1n]);
      
      // Check buyer balance after refund
      const buyerBalanceAfter = await publicClient.getBalance({
        address: otherAccount.account.address
      });
      
      // Buyer should receive the escrow amount (minus gas fees)
      expect(buyerBalanceAfter).to.be.greaterThan(buyerBalanceBefore);
      
      // Check escrow status
      const escrowDetails = await escrow.read.getEscrow([1n]);
      expect(escrowDetails.status).to.equal(3n); // REFUNDED = 3
    });

    it("Should raise and resolve dispute", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Create escrow
      const escrowAmount = parseGwei("1000000000");
      const productId = 1n;
      
      await escrow.write.createEscrow([
        otherAccount.account.address,
        owner.account.address,
        productId
      ], {
        value: escrowAmount
      });
      
      // Raise dispute (buyer raises dispute)
      await escrow.write.raiseDispute([1n]);
      
      // Check escrow status
      let escrowDetails = await escrow.read.getEscrow([1n]);
      expect(escrowDetails.status).to.equal(4n); // DISPUTED = 4
      
      // Resolve dispute (owner resolves in favor of seller)
      await escrow.write.resolveDispute([1n, true]);
      
      // Check final status
      escrowDetails = await escrow.read.getEscrow([1n]);
      expect(escrowDetails.status).to.equal(5n); // RESOLVED = 5
    });
  });

  describe("View Functions", function () {
    it("Should return buyer escrows", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Create multiple escrows for the same buyer
      await escrow.write.createEscrow([otherAccount.account.address, owner.account.address, 1n], {
        value: parseGwei("1000000000")
      });
      await escrow.write.createEscrow([otherAccount.account.address, owner.account.address, 2n], {
        value: parseGwei("1000000000")
      });
      
      const buyerEscrows = await escrow.read.getBuyerEscrows([otherAccount.account.address]);
      expect(buyerEscrows).to.have.lengthOf(2);
      expect(buyerEscrows[0]).to.equal(1n);
      expect(buyerEscrows[1]).to.equal(2n);
    });

    it("Should return seller escrows", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Create multiple escrows for the same seller
      await escrow.write.createEscrow([otherAccount.account.address, owner.account.address, 1n], {
        value: parseGwei("1000000000")
      });
      await escrow.write.createEscrow([otherAccount.account.address, owner.account.address, 2n], {
        value: parseGwei("1000000000")
      });
      
      const sellerEscrows = await escrow.read.getSellerEscrows([owner.account.address]);
      expect(sellerEscrows).to.have.lengthOf(2);
      expect(sellerEscrows[0]).to.equal(1n);
      expect(sellerEscrows[1]).to.equal(2n);
    });

    it("Should check dispute window", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Create escrow
      await escrow.write.createEscrow([otherAccount.account.address, owner.account.address, 1n], {
        value: parseGwei("1000000000")
      });
      
      // Check if dispute window is open (should be true initially)
      const isDisputeWindowOpen = await escrow.read.isDisputeWindowOpen([1n]);
      expect(isDisputeWindowOpen).to.be.true;
      
      // Get time remaining
      const timeRemaining = await escrow.read.getDisputeTimeRemaining([1n]);
      expect(timeRemaining).to.be.greaterThan(0n);
    });
  });

  describe("Error Conditions", function () {
    it("Should fail to release payment twice", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Create and release escrow
      await escrow.write.createEscrow([otherAccount.account.address, owner.account.address, 1n], {
        value: parseGwei("1000000000")
      });
      await escrow.write.releasePayment([1n]);
      
      // Try to release again - should fail
      await expect(
        escrow.write.releasePayment([1n])
      ).to.be.rejectedWith("InvalidState");
    });

    it("Should fail to refund twice", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Create and refund escrow
      await escrow.write.createEscrow([otherAccount.account.address, owner.account.address, 1n], {
        value: parseGwei("1000000000")
      });
      await escrow.write.refund([1n]);
      
      // Try to refund again - should fail
      await expect(
        escrow.write.refund([1n])
      ).to.be.rejectedWith("InvalidState");
    });

    it("Should fail to raise dispute twice", async function () {
      const { escrow, marketplace, owner, otherAccount, publicClient } = await loadFixture(deployContract);

      // Create escrow and raise dispute
      await escrow.write.createEscrow([otherAccount.account.address, owner.account.address, 1n], {
        value: parseGwei("1000000000")
      });
      await escrow.write.raiseDispute([1n]);
      
      // Try to raise dispute again - should fail
      await expect(
        escrow.write.raiseDispute([1n])
      ).to.be.rejectedWith("DisputeAlreadyRaised");
    });
  });
});
