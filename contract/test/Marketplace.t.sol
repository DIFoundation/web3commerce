// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {Marketplace} from "../src/Marketplace.sol";
import {Escrow} from "../src/Escrow.sol";

contract MarketplaceTest is Test {
    Marketplace public marketplace;
    Escrow public escrow;

    address public owner;
    address public seller1;
    address public seller2;
    address public buyer1;
    address public buyer2;

    string constant STORE_NAME = "Test Store";
    string constant STORE_DESC = "A test store description";
    string constant PRODUCT_NAME = "Test Product";
    string constant PRODUCT_DESC = "A test product";
    string constant IPFS_HASH = "QmTest123";
    string constant SHIPPING = "123 Test St";

    uint256 constant PRICE = 0.5 ether;
    uint256 constant STOCK = 10;

    event SellerRegistered(
        address indexed seller,
        string storeName,
        uint256 registeredAt
    );
    event ProductCreated(
        uint256 indexed productId,
        address indexed seller,
        string name,
        uint256 price
    );
    event ProductUpdated(
        uint256 indexed productId,
        uint256 newPrice,
        uint256 newStock,
        bool isActive
    );
    event ProductRemoved(uint256 indexed productId, address indexed seller);
    event OrderCreated(
        uint256 indexed orderId,
        uint256 indexed productId,
        address indexed buyer,
        address seller,
        uint256 totalAmount,
        uint256 escrowId
    );
    event OrderStatusChanged(
        uint256 indexed orderId,
        Marketplace.OrderStatus oldStatus,
        Marketplace.OrderStatus newStatus
    );

    function setUp() public {
        owner = address(this);
        seller1 = address(0x1);
        seller2 = address(0x2);
        buyer1 = address(0x3);
        buyer2 = address(0x4);

        vm.deal(seller1, 10 ether);
        vm.deal(seller2, 10 ether);
        vm.deal(buyer1, 10 ether);
        vm.deal(buyer2, 10 ether);

        // Deploy Escrow first
        escrow = new Escrow();

        // Deploy Marketplace with Escrow
        marketplace = new Marketplace(payable(address(escrow)));

        // Set marketplace in escrow
        escrow.setMarketplace(address(marketplace));
    }

    // ============ Seller Registration Tests ============

    function test_RegisterSeller() public {
        vm.expectEmit(true, false, false, true);
        emit SellerRegistered(seller1, STORE_NAME, block.timestamp);

        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        (address addr, string memory name, string memory desc, bool isActive, ) = marketplace.sellers(seller1);
        assertEq(addr, seller1);
        assertEq(name, STORE_NAME);
        assertEq(desc, STORE_DESC);
        assertTrue(isActive);
        assertTrue(marketplace.isSeller(seller1));
    }

    function test_RevertRegisterSeller_AlreadySeller() public {
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.prank(seller1);
        vm.expectRevert(Marketplace.Marketplace__AlreadySeller.selector);
        marketplace.registerSeller("Another Store", "Description");
    }

    // ============ Product Creation Tests ============

    function test_CreateProduct() public {
        // Register as seller first
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.prank(seller1);
        vm.expectEmit(true, true, false, true);
        emit ProductCreated(1, seller1, PRODUCT_NAME, PRICE);

        uint256 productId = marketplace.createProduct(
            PRODUCT_NAME,
            PRODUCT_DESC,
            PRICE,
            STOCK,
            IPFS_HASH
        );

        assertEq(productId, 1);

        (
            uint256 id,
            address seller,
            string memory name,
            string memory desc,
            uint256 price,
            uint256 stock,
            string memory ipfs,
            bool isActive,

        ) = marketplace.products(productId);

        assertEq(id, 1);
        assertEq(seller, seller1);
        assertEq(name, PRODUCT_NAME);
        assertEq(desc, PRODUCT_DESC);
        assertEq(price, PRICE);
        assertEq(stock, STOCK);
        assertEq(ipfs, IPFS_HASH);
        assertTrue(isActive);
    }

    function test_RevertCreateProduct_NotSeller() public {
        vm.prank(buyer1);
        vm.expectRevert(Marketplace.Marketplace__NotSeller.selector);
        marketplace.createProduct(PRODUCT_NAME, PRODUCT_DESC, PRICE, STOCK, IPFS_HASH);
    }

    function test_RevertCreateProduct_InvalidPrice() public {
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.prank(seller1);
        vm.expectRevert(Marketplace.Marketplace__InvalidPrice.selector);
        marketplace.createProduct(PRODUCT_NAME, PRODUCT_DESC, 0, STOCK, IPFS_HASH);
    }

    function test_RevertCreateProduct_InvalidIPFS() public {
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.prank(seller1);
        vm.expectRevert(Marketplace.Marketplace__InvalidIPFSHash.selector);
        marketplace.createProduct(PRODUCT_NAME, PRODUCT_DESC, PRICE, STOCK, "");
    }

    // ============ Product Update Tests ============

    function test_UpdateProduct() public {
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.prank(seller1);
        uint256 productId = marketplace.createProduct(
            PRODUCT_NAME,
            PRODUCT_DESC,
            PRICE,
            STOCK,
            IPFS_HASH
        );

        uint256 newPrice = 0.75 ether;
        uint256 newStock = 5;

        vm.prank(seller1);
        vm.expectEmit(true, false, false, true);
        emit ProductUpdated(productId, newPrice, newStock, true);

        marketplace.updateProduct(productId, newPrice, newStock, true);

        (, , , , uint256 price, uint256 stock, , bool isActive, ) = marketplace.products(productId);
        assertEq(price, newPrice);
        assertEq(stock, newStock);
        assertTrue(isActive);
    }

    function test_RevertUpdateProduct_NotOwner() public {
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.prank(seller1);
        uint256 productId = marketplace.createProduct(
            PRODUCT_NAME,
            PRODUCT_DESC,
            PRICE,
            STOCK,
            IPFS_HASH
        );

        // Register seller2 as seller first, then test ownership
        vm.prank(seller2);
        marketplace.registerSeller("Store 2", "Description 2");

        vm.prank(seller2);
        vm.expectRevert(Marketplace.Marketplace__NotProductOwner.selector);
        marketplace.updateProduct(productId, PRICE, STOCK, true);
    }

    // ============ Product Removal Tests ============

    function test_RemoveProduct() public {
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.prank(seller1);
        uint256 productId = marketplace.createProduct(
            PRODUCT_NAME,
            PRODUCT_DESC,
            PRICE,
            STOCK,
            IPFS_HASH
        );

        vm.prank(seller1);
        vm.expectEmit(true, true, false, false);
        emit ProductRemoved(productId, seller1);

        marketplace.removeProduct(productId);

        (, , , , , , , bool isActive, ) = marketplace.products(productId);
        assertFalse(isActive);
    }

    // ============ Order Creation Tests ============

    function test_CreateOrder() public {
        // Setup seller and product
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.prank(seller1);
        uint256 productId = marketplace.createProduct(
            PRODUCT_NAME,
            PRODUCT_DESC,
            PRICE,
            STOCK,
            IPFS_HASH
        );

        uint256 quantity = 2;
        uint256 totalAmount = PRICE * quantity;

        vm.prank(buyer1);
        vm.expectEmit(true, true, true, true);
        emit OrderCreated(1, productId, buyer1, seller1, totalAmount, 1);

        (uint256 orderId, uint256 escrowId) = marketplace.createOrder{value: totalAmount}(
            productId,
            quantity,
            SHIPPING
        );

        assertEq(orderId, 1);
        assertEq(escrowId, 1);

        (
            uint256 id,
            uint256 pid,
            address buyer,
            address seller,
            uint256 qty,
            uint256 amount,
            string memory shipping,
            Marketplace.OrderStatus status,
            ,
            uint256 eid
        ) = marketplace.orders(orderId);

        assertEq(id, 1);
        assertEq(pid, productId);
        assertEq(buyer, buyer1);
        assertEq(seller, seller1);
        assertEq(qty, quantity);
        assertEq(amount, totalAmount);
        assertEq(shipping, SHIPPING);
        assertEq(uint256(status), uint256(Marketplace.OrderStatus.PAID));
        assertEq(eid, escrowId);

        // Check stock was reduced
        (
            ,
            ,
            ,
            ,
            ,
            uint256 stockAfterOrder,
            ,
            ,

        ) = marketplace.products(productId);
        assertEq(stockAfterOrder, STOCK - quantity);
    }

    function test_RevertCreateOrder_ProductNotActive() public {
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.prank(seller1);
        uint256 productId = marketplace.createProduct(
            PRODUCT_NAME,
            PRODUCT_DESC,
            PRICE,
            STOCK,
            IPFS_HASH
        );

        vm.prank(seller1);
        marketplace.removeProduct(productId);

        vm.prank(buyer1);
        vm.expectRevert(Marketplace.Marketplace__ProductNotActive.selector);
        marketplace.createOrder{value: PRICE}(productId, 1, SHIPPING);
    }

    function test_RevertCreateOrder_InsufficientStock() public {
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.prank(seller1);
        uint256 productId = marketplace.createProduct(
            PRODUCT_NAME,
            PRODUCT_DESC,
            PRICE,
            STOCK,
            IPFS_HASH
        );

        vm.prank(buyer1);
        vm.expectRevert(Marketplace.Marketplace__InvalidPrice.selector);
        marketplace.createOrder{value: PRICE * (STOCK + 1)}(productId, STOCK + 1, SHIPPING);
    }

    function test_RevertCreateOrder_SellerCannotBuyOwnProduct() public {
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.prank(seller1);
        uint256 productId = marketplace.createProduct(
            PRODUCT_NAME,
            PRODUCT_DESC,
            PRICE,
            STOCK,
            IPFS_HASH
        );

        vm.prank(seller1);
        vm.expectRevert(Marketplace.Marketplace__Unauthorized.selector);
        marketplace.createOrder{value: PRICE}(productId, 1, SHIPPING);
    }

    function test_RevertCreateOrder_IncorrectPayment() public {
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.prank(seller1);
        uint256 productId = marketplace.createProduct(
            PRODUCT_NAME,
            PRODUCT_DESC,
            PRICE,
            STOCK,
            IPFS_HASH
        );

        vm.prank(buyer1);
        vm.expectRevert(Marketplace.Marketplace__InvalidPrice.selector);
        marketplace.createOrder{value: PRICE - 0.1 ether}(productId, 1, SHIPPING);
    }

    // ============ Order Confirmation Tests ============

    function test_ConfirmOrder() public {
        // Setup and create order
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.prank(seller1);
        uint256 productId = marketplace.createProduct(PRODUCT_NAME, PRODUCT_DESC, PRICE, STOCK, IPFS_HASH);

        vm.prank(buyer1);
        (uint256 orderId, ) = marketplace.createOrder{value: PRICE}(productId, 1, SHIPPING);

        uint256 sellerBalanceBefore = seller1.balance;

        vm.prank(buyer1);
        vm.expectEmit(true, false, false, true);
        emit OrderStatusChanged(orderId, Marketplace.OrderStatus.PAID, Marketplace.OrderStatus.COMPLETED);

        marketplace.confirmOrder(orderId);

        (, , , , , , , Marketplace.OrderStatus status, , ) = marketplace.orders(orderId);
        assertEq(uint256(status), uint256(Marketplace.OrderStatus.COMPLETED));

        // Seller should have received funds
        assertEq(seller1.balance, sellerBalanceBefore + PRICE);
    }

    function test_RevertConfirmOrder_NotBuyer() public {
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.prank(seller1);
        uint256 productId = marketplace.createProduct(PRODUCT_NAME, PRODUCT_DESC, PRICE, STOCK, IPFS_HASH);

        vm.prank(buyer1);
        (uint256 orderId, ) = marketplace.createOrder{value: PRICE}(productId, 1, SHIPPING);

        vm.prank(seller1);
        vm.expectRevert(Marketplace.Marketplace__Unauthorized.selector);
        marketplace.confirmOrder(orderId);
    }

    // ============ Order Cancellation Tests ============

    function test_CancelOrderByBuyer() public {
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.prank(seller1);
        uint256 productId = marketplace.createProduct(PRODUCT_NAME, PRODUCT_DESC, PRICE, STOCK, IPFS_HASH);

        vm.prank(buyer1);
        (uint256 orderId, ) = marketplace.createOrder{value: PRICE}(productId, 1, SHIPPING);

        uint256 buyerBalanceBefore = buyer1.balance;

        vm.prank(buyer1);
        marketplace.cancelOrder(orderId);

        (, , , , , , , Marketplace.OrderStatus status, , ) = marketplace.orders(orderId);
        assertEq(uint256(status), uint256(Marketplace.OrderStatus.CANCELLED));

        // Stock should be restored
        (, , , , , uint256 stock, , , ) = marketplace.products(productId);
        assertEq(stock, STOCK);

        // Buyer should have been refunded
        assertEq(buyer1.balance, buyerBalanceBefore + PRICE);
    }

    function test_CancelOrderBySeller() public {
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.prank(seller1);
        uint256 productId = marketplace.createProduct(PRODUCT_NAME, PRODUCT_DESC, PRICE, STOCK, IPFS_HASH);

        vm.prank(buyer1);
        (uint256 orderId, ) = marketplace.createOrder{value: PRICE}(productId, 1, SHIPPING);

        uint256 buyerBalanceBefore = buyer1.balance;

        vm.prank(seller1);
        marketplace.cancelOrder(orderId);

        (, , , , , , , Marketplace.OrderStatus status, , ) = marketplace.orders(orderId);
        assertEq(uint256(status), uint256(Marketplace.OrderStatus.CANCELLED));
        assertEq(buyer1.balance, buyerBalanceBefore + PRICE);
    }

    // ============ View Function Tests ============

    function test_GetSellerProducts() public {
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.startPrank(seller1);
        uint256 p1 = marketplace.createProduct("Product 1", "Desc", PRICE, STOCK, IPFS_HASH);
        uint256 p2 = marketplace.createProduct("Product 2", "Desc", PRICE, STOCK, IPFS_HASH);
        vm.stopPrank();

        uint256[] memory products = marketplace.getSellerProducts(seller1);
        assertEq(products.length, 2);
        assertEq(products[0], p1);
        assertEq(products[1], p2);
    }

    function test_GetBuyerOrders() public {
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.prank(seller1);
        uint256 productId = marketplace.createProduct(PRODUCT_NAME, PRODUCT_DESC, PRICE, STOCK, IPFS_HASH);

        vm.prank(buyer1);
        (uint256 orderId, ) = marketplace.createOrder{value: PRICE}(productId, 1, SHIPPING);

        uint256[] memory orders = marketplace.getBuyerOrders(buyer1);
        assertEq(orders.length, 1);
        assertEq(orders[0], orderId);
    }

    function test_GetSellerOrders() public {
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.prank(seller1);
        uint256 productId = marketplace.createProduct(PRODUCT_NAME, PRODUCT_DESC, PRICE, STOCK, IPFS_HASH);

        vm.prank(buyer1);
        (uint256 orderId, ) = marketplace.createOrder{value: PRICE}(productId, 1, SHIPPING);

        uint256[] memory orders = marketplace.getSellerOrders(seller1);
        assertEq(orders.length, 1);
        assertEq(orders[0], orderId);
    }

    function test_GetProducts() public {
        vm.prank(seller1);
        marketplace.registerSeller(STORE_NAME, STORE_DESC);

        vm.startPrank(seller1);
        uint256 p1 = marketplace.createProduct("Product 1", "Desc", PRICE, STOCK, IPFS_HASH);
        uint256 p2 = marketplace.createProduct("Product 2", "Desc", PRICE, STOCK, IPFS_HASH);
        vm.stopPrank();

        uint256[] memory ids = new uint256[](2);
        ids[0] = p1;
        ids[1] = p2;

        Marketplace.Product[] memory products = marketplace.getProducts(ids);
        assertEq(products.length, 2);
        assertEq(products[0].name, "Product 1");
        assertEq(products[1].name, "Product 2");
    }

    // ============ Admin Function Tests ============

    function test_SetEscrowContract() public {
        Escrow newEscrow = new Escrow();

        marketplace.setEscrowContract(payable(address(newEscrow)));

        assertEq(address(marketplace.escrowContract()), address(newEscrow));
    }

    function test_RevertSetEscrowContract_NotOwner() public {
        Escrow newEscrow = new Escrow();

        vm.prank(seller1);
        vm.expectRevert(Marketplace.Marketplace__Unauthorized.selector);
        marketplace.setEscrowContract(payable(address(newEscrow)));
    }

    function test_TransferOwnership() public {
        address newOwner = address(0x99);

        marketplace.transferOwnership(newOwner);

        vm.prank(newOwner);
        marketplace.setEscrowContract(payable(address(0x5)));
    }
}
