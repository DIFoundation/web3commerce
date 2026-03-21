// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {Escrow} from "../src/Escrow.sol";

contract EscrowTest is Test {
    Escrow public escrow;

    address public owner;
    address public marketplace;
    address public buyer;
    address public seller;

    uint256 public constant PRODUCT_ID = 1;
    uint256 public constant ESCROW_AMOUNT = 1 ether;

    event EscrowCreated(
        uint256 indexed escrowId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        uint256 productId
    );
    event PaymentReleased(
        uint256 indexed escrowId,
        address indexed seller,
        uint256 amount
    );
    event RefundIssued(
        uint256 indexed escrowId,
        address indexed buyer,
        uint256 amount
    );
    event DisputeRaised(
        uint256 indexed escrowId,
        address indexed raisedBy,
        uint256 raisedAt
    );
    event DisputeResolved(
        uint256 indexed escrowId,
        Escrow.EscrowStatus resolution,
        address indexed resolver
    );

    function setUp() public {
        owner = address(this);
        marketplace = address(0x1);
        buyer = address(0x2);
        seller = address(0x3);

        vm.deal(buyer, 10 ether);
        vm.deal(seller, 10 ether);
        vm.deal(marketplace, 10 ether);

        escrow = new Escrow();
        escrow.setMarketplace(marketplace);
    }

    // ============ Create Escrow Tests ============

    function test_CreateEscrow() public {
        vm.prank(marketplace);
        vm.expectEmit(true, true, true, true);
        emit EscrowCreated(1, buyer, seller, ESCROW_AMOUNT, PRODUCT_ID);

        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            buyer,
            seller,
            PRODUCT_ID
        );

        assertEq(escrowId, 1);
        assertEq(address(escrow).balance, ESCROW_AMOUNT);

        Escrow.EscrowData memory data = escrow.getEscrow(escrowId);
        assertEq(data.buyer, buyer);
        assertEq(data.seller, seller);
        assertEq(data.amount, ESCROW_AMOUNT);
        assertEq(data.productId, PRODUCT_ID);
        assertEq(uint256(data.status), uint256(Escrow.EscrowStatus.PENDING));
    }

    function test_RevertCreateEscrow_NotMarketplace() public {
        vm.prank(buyer);
        vm.expectRevert(Escrow.Escrow__NotAuthorized.selector);
        escrow.createEscrow{value: ESCROW_AMOUNT}(buyer, seller, PRODUCT_ID);
    }

    function test_RevertCreateEscrow_ZeroBuyer() public {
        vm.prank(marketplace);
        vm.expectRevert(Escrow.Escrow__ZeroAddress.selector);
        escrow.createEscrow{value: ESCROW_AMOUNT}(address(0), seller, PRODUCT_ID);
    }

    function test_RevertCreateEscrow_ZeroSeller() public {
        vm.prank(marketplace);
        vm.expectRevert(Escrow.Escrow__ZeroAddress.selector);
        escrow.createEscrow{value: ESCROW_AMOUNT}(buyer, address(0), PRODUCT_ID);
    }

    function test_RevertCreateEscrow_ZeroAmount() public {
        vm.prank(marketplace);
        vm.expectRevert(Escrow.Escrow__InvalidAmount.selector);
        escrow.createEscrow{value: 0}(buyer, seller, PRODUCT_ID);
    }

    // ============ Release Payment Tests ============

    function test_ReleasePaymentByBuyer() public {
        // Create escrow first
        vm.prank(marketplace);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            buyer,
            seller,
            PRODUCT_ID
        );

        uint256 sellerBalanceBefore = seller.balance;

        vm.prank(buyer);
        vm.expectEmit(true, true, false, true);
        emit PaymentReleased(escrowId, seller, ESCROW_AMOUNT);
        escrow.releasePayment(escrowId);

        Escrow.EscrowData memory data = escrow.getEscrow(escrowId);
        assertEq(uint256(data.status), uint256(Escrow.EscrowStatus.RELEASED));
        assertEq(seller.balance, sellerBalanceBefore + ESCROW_AMOUNT);
    }

    function test_ReleasePaymentByMarketplace() public {
        vm.prank(marketplace);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            buyer,
            seller,
            PRODUCT_ID
        );

        uint256 sellerBalanceBefore = seller.balance;

        vm.prank(marketplace);
        escrow.releasePayment(escrowId);

        assertEq(seller.balance, sellerBalanceBefore + ESCROW_AMOUNT);
    }

    function test_RevertReleasePayment_AlreadyReleased() public {
        vm.prank(marketplace);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            buyer,
            seller,
            PRODUCT_ID
        );

        vm.prank(buyer);
        escrow.releasePayment(escrowId);

        vm.prank(buyer);
        vm.expectRevert(Escrow.Escrow__InvalidState.selector);
        escrow.releasePayment(escrowId);
    }

    function test_RevertReleasePayment_Unauthorized() public {
        vm.prank(marketplace);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            buyer,
            seller,
            PRODUCT_ID
        );

        address randomUser = address(0x99);
        vm.prank(randomUser);
        vm.expectRevert(Escrow.Escrow__NotAuthorized.selector);
        escrow.releasePayment(escrowId);
    }

    // ============ Refund Tests ============

    function test_RefundBySeller() public {
        vm.prank(marketplace);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            buyer,
            seller,
            PRODUCT_ID
        );

        uint256 buyerBalanceBefore = buyer.balance;

        vm.prank(seller);
        vm.expectEmit(true, true, false, true);
        emit RefundIssued(escrowId, buyer, ESCROW_AMOUNT);
        escrow.refund(escrowId);

        Escrow.EscrowData memory data = escrow.getEscrow(escrowId);
        assertEq(uint256(data.status), uint256(Escrow.EscrowStatus.REFUNDED));
        assertEq(buyer.balance, buyerBalanceBefore + ESCROW_AMOUNT);
    }

    function test_RefundByMarketplace() public {
        vm.prank(marketplace);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            buyer,
            seller,
            PRODUCT_ID
        );

        uint256 buyerBalanceBefore = buyer.balance;

        vm.prank(marketplace);
        escrow.refund(escrowId);

        assertEq(buyer.balance, buyerBalanceBefore + ESCROW_AMOUNT);
    }

    function test_RevertRefund_AlreadyReleased() public {
        vm.prank(marketplace);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            buyer,
            seller,
            PRODUCT_ID
        );

        vm.prank(buyer);
        escrow.releasePayment(escrowId);

        vm.prank(seller);
        vm.expectRevert(Escrow.Escrow__InvalidState.selector);
        escrow.refund(escrowId);
    }

    // ============ Dispute Tests ============

    function test_RaiseDisputeByBuyer() public {
        vm.prank(marketplace);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            buyer,
            seller,
            PRODUCT_ID
        );

        vm.prank(buyer);
        vm.expectEmit(true, true, false, true);
        emit DisputeRaised(escrowId, buyer, block.timestamp);
        escrow.raiseDispute(escrowId);

        Escrow.EscrowData memory data = escrow.getEscrow(escrowId);
        assertEq(uint256(data.status), uint256(Escrow.EscrowStatus.DISPUTED));
        assertGt(data.disputeRaisedAt, 0);
    }

    function test_RaiseDisputeBySeller() public {
        vm.prank(marketplace);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            buyer,
            seller,
            PRODUCT_ID
        );

        vm.prank(seller);
        escrow.raiseDispute(escrowId);

        Escrow.EscrowData memory data = escrow.getEscrow(escrowId);
        assertEq(uint256(data.status), uint256(Escrow.EscrowStatus.DISPUTED));
    }

    function test_RevertRaiseDispute_AfterWindow() public {
        vm.prank(marketplace);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            buyer,
            seller,
            PRODUCT_ID
        );

        // Fast forward past dispute window
        vm.warp(block.timestamp + 8 days);

        vm.prank(buyer);
        vm.expectRevert(Escrow.Escrow__DisputeWindowClosed.selector);
        escrow.raiseDispute(escrowId);
    }

    function test_RevertRaiseDispute_AlreadyDisputed() public {
        vm.prank(marketplace);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            buyer,
            seller,
            PRODUCT_ID
        );

        vm.prank(buyer);
        escrow.raiseDispute(escrowId);

        // After dispute is raised, status is DISPUTED so it reverts with InvalidState
        vm.prank(seller);
        vm.expectRevert(Escrow.Escrow__InvalidState.selector);
        escrow.raiseDispute(escrowId);
    }

    // ============ Dispute Resolution Tests ============

    function test_ResolveDispute_ReleaseToSeller() public {
        vm.prank(marketplace);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            buyer,
            seller,
            PRODUCT_ID
        );

        vm.prank(buyer);
        escrow.raiseDispute(escrowId);

        uint256 sellerBalanceBefore = seller.balance;

        vm.expectEmit(true, false, true, true);
        emit DisputeResolved(escrowId, Escrow.EscrowStatus.RELEASED, owner);
        escrow.resolveDispute(escrowId, true); // release to seller

        Escrow.EscrowData memory data = escrow.getEscrow(escrowId);
        assertEq(uint256(data.status), uint256(Escrow.EscrowStatus.RESOLVED));
        assertEq(seller.balance, sellerBalanceBefore + ESCROW_AMOUNT);
    }

    function test_ResolveDispute_RefundToBuyer() public {
        vm.prank(marketplace);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            buyer,
            seller,
            PRODUCT_ID
        );

        vm.prank(seller);
        escrow.raiseDispute(escrowId);

        uint256 buyerBalanceBefore = buyer.balance;

        escrow.resolveDispute(escrowId, false); // refund to buyer

        assertEq(buyer.balance, buyerBalanceBefore + ESCROW_AMOUNT);
    }

    function test_RevertResolveDispute_NotOwner() public {
        vm.prank(marketplace);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            buyer,
            seller,
            PRODUCT_ID
        );

        vm.prank(buyer);
        escrow.raiseDispute(escrowId);

        vm.prank(buyer);
        vm.expectRevert(Escrow.Escrow__NotAuthorized.selector);
        escrow.resolveDispute(escrowId, true);
    }

    // ============ View Function Tests ============

    function test_GetBuyerEscrows() public {
        vm.startPrank(marketplace);
        escrow.createEscrow{value: ESCROW_AMOUNT}(buyer, seller, 1);
        escrow.createEscrow{value: ESCROW_AMOUNT}(buyer, seller, 2);
        escrow.createEscrow{value: ESCROW_AMOUNT}(address(0x5), seller, 3);
        vm.stopPrank();

        uint256[] memory buyerEscrows = escrow.getBuyerEscrows(buyer);
        assertEq(buyerEscrows.length, 2);
        assertEq(buyerEscrows[0], 1);
        assertEq(buyerEscrows[1], 2);
    }

    function test_GetSellerEscrows() public {
        vm.startPrank(marketplace);
        escrow.createEscrow{value: ESCROW_AMOUNT}(buyer, seller, 1);
        escrow.createEscrow{value: ESCROW_AMOUNT}(buyer, seller, 2);
        vm.stopPrank();

        uint256[] memory sellerEscrows = escrow.getSellerEscrows(seller);
        assertEq(sellerEscrows.length, 2);
    }

    function test_IsDisputeWindowOpen() public {
        vm.prank(marketplace);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            buyer,
            seller,
            PRODUCT_ID
        );

        assertTrue(escrow.isDisputeWindowOpen(escrowId));

        vm.warp(block.timestamp + 8 days);
        assertFalse(escrow.isDisputeWindowOpen(escrowId));
    }

    function test_GetDisputeTimeRemaining() public {
        vm.prank(marketplace);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            buyer,
            seller,
            PRODUCT_ID
        );

        uint256 remaining = escrow.getDisputeTimeRemaining(escrowId);
        assertEq(remaining, 7 days);

        vm.warp(block.timestamp + 3 days);
        remaining = escrow.getDisputeTimeRemaining(escrowId);
        assertEq(remaining, 4 days);

        vm.warp(block.timestamp + 5 days);
        remaining = escrow.getDisputeTimeRemaining(escrowId);
        assertEq(remaining, 0);
    }

    // ============ Admin Function Tests ============

    function test_SetMarketplace() public {
        address newMarketplace = address(0x99);
        vm.expectEmit(true, false, false, false);
        emit Escrow.MarketplaceSet(newMarketplace);
        escrow.setMarketplace(newMarketplace);

        // Test that new marketplace can create escrow
        vm.deal(newMarketplace, 1 ether);
        vm.prank(newMarketplace);
        uint256 escrowId = escrow.createEscrow{value: ESCROW_AMOUNT}(
            buyer,
            seller,
            PRODUCT_ID
        );
        assertEq(escrowId, 1);
    }

    function test_RevertSetMarketplace_NotOwner() public {
        vm.prank(buyer);
        vm.expectRevert(Escrow.Escrow__NotAuthorized.selector);
        escrow.setMarketplace(address(0x99));
    }

    function test_TransferOwnership() public {
        address newOwner = address(0x99);
        escrow.transferOwnership(newOwner);

        vm.prank(newOwner);
        escrow.setMarketplace(address(0x5));
    }

    function test_EmergencyWithdraw() public {
        vm.prank(marketplace);
        escrow.createEscrow{value: ESCROW_AMOUNT}(buyer, seller, PRODUCT_ID);

        address payable recipient = payable(address(0x99));
        uint256 recipientBalanceBefore = recipient.balance;

        escrow.emergencyWithdraw(recipient, ESCROW_AMOUNT);

        assertEq(recipient.balance, recipientBalanceBefore + ESCROW_AMOUNT);
    }

    function test_ReceiveRevert() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        vm.expectRevert("Direct deposits not allowed");
        (bool success, ) = address(escrow).call{value: 1 ether}("");
        // The call should fail
    }
}
