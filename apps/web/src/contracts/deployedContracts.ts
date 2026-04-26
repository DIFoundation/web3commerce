const deployedContracts = {
  Escrow: {
    address: "0xe883f652DFe5fA15151dBd02123E2eA77F498159",
    abi: [
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [],
        name: "Escrow__AlreadyRefunded",
        type: "error",
      },
      {
        inputs: [],
        name: "Escrow__AlreadyReleased",
        type: "error",
      },
      {
        inputs: [],
        name: "Escrow__DisputeAlreadyRaised",
        type: "error",
      },
      {
        inputs: [],
        name: "Escrow__DisputeWindowClosed",
        type: "error",
      },
      {
        inputs: [],
        name: "Escrow__EscrowNotFound",
        type: "error",
      },
      {
        inputs: [],
        name: "Escrow__InvalidAmount",
        type: "error",
      },
      {
        inputs: [],
        name: "Escrow__InvalidState",
        type: "error",
      },
      {
        inputs: [],
        name: "Escrow__NoDispute",
        type: "error",
      },
      {
        inputs: [],
        name: "Escrow__NotAuthorized",
        type: "error",
      },
      {
        inputs: [],
        name: "Escrow__TransferFailed",
        type: "error",
      },
      {
        inputs: [],
        name: "Escrow__ZeroAddress",
        type: "error",
      },
      {
        inputs: [],
        name: "Marketplace__AlreadySet",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "auction",
            type: "address",
          },
        ],
        name: "AuctionContractSet",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "escrowId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "raisedBy",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "raisedAt",
            type: "uint256",
          },
        ],
        name: "DisputeRaised",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "escrowId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "enum Escrow.EscrowStatus",
            name: "resolution",
            type: "uint8",
          },
          {
            indexed: true,
            internalType: "address",
            name: "resolver",
            type: "address",
          },
        ],
        name: "DisputeResolved",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "escrowId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "buyer",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "productId",
            type: "uint256",
          },
        ],
        name: "EscrowCreated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "marketplace",
            type: "address",
          },
        ],
        name: "MarketplaceSet",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "escrowId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "PaymentReleased",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "escrowId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "buyer",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "RefundIssued",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "emergencyWithdrawn",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "ownershipTransfered",
        type: "event",
      },
      {
        inputs: [],
        name: "DISPUTE_WINDOW",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "auctionContract",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "buyerEscrows",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_buyer",
            type: "address",
          },
          {
            internalType: "address",
            name: "_seller",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_productId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_orderId",
            type: "uint256",
          },
        ],
        name: "createEscrow",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address payable",
            name: "_to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_amount",
            type: "uint256",
          },
        ],
        name: "emergencyWithdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "escrowCounter",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "escrows",
        outputs: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "orderId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "buyer",
            type: "address",
          },
          {
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "productId",
            type: "uint256",
          },
          {
            internalType: "enum Escrow.EscrowStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "disputeRaisedAt",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "resolver",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_buyer",
            type: "address",
          },
        ],
        name: "getBuyerEscrows",
        outputs: [
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_escrowId",
            type: "uint256",
          },
        ],
        name: "getDisputeTimeRemaining",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_escrowId",
            type: "uint256",
          },
        ],
        name: "getEscrow",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "orderId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "buyer",
                type: "address",
              },
              {
                internalType: "address",
                name: "seller",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "productId",
                type: "uint256",
              },
              {
                internalType: "enum Escrow.EscrowStatus",
                name: "status",
                type: "uint8",
              },
              {
                internalType: "uint256",
                name: "createdAt",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "disputeRaisedAt",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "resolver",
                type: "address",
              },
            ],
            internalType: "struct Escrow.EscrowData",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_seller",
            type: "address",
          },
        ],
        name: "getSellerEscrows",
        outputs: [
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_escrowId",
            type: "uint256",
          },
        ],
        name: "isDisputeWindowOpen",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "marketplace",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_escrowId",
            type: "uint256",
          },
        ],
        name: "raiseDispute",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_escrowId",
            type: "uint256",
          },
        ],
        name: "refund",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_escrowId",
            type: "uint256",
          },
        ],
        name: "releasePayment",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_escrowId",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "_releaseToSeller",
            type: "bool",
          },
        ],
        name: "resolveDispute",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "sellerEscrows",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_auction",
            type: "address",
          },
        ],
        name: "setAuctionContract",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_marketplace",
            type: "address",
          },
        ],
        name: "setMarketplace",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_newOwner",
            type: "address",
          },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        stateMutability: "payable",
        type: "receive",
      },
    ],
  },
  Marketplace: {
    address: "0x692050a31F0E5bF3C11f4e1C013AF86C9d4a7575",
    abi: [
      {
        inputs: [
          {
            internalType: "address payable",
            name: "_escrowContract",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [],
        name: "Marketplace__AlreadySeller",
        type: "error",
      },
      {
        inputs: [],
        name: "Marketplace__EscrowNotSet",
        type: "error",
      },
      {
        inputs: [],
        name: "Marketplace__InsufficientStock",
        type: "error",
      },
      {
        inputs: [],
        name: "Marketplace__InvalidIPFSHash",
        type: "error",
      },
      {
        inputs: [],
        name: "Marketplace__InvalidPrice",
        type: "error",
      },
      {
        inputs: [],
        name: "Marketplace__InvalidState",
        type: "error",
      },
      {
        inputs: [],
        name: "Marketplace__NotProductOwner",
        type: "error",
      },
      {
        inputs: [],
        name: "Marketplace__NotSeller",
        type: "error",
      },
      {
        inputs: [],
        name: "Marketplace__OrderNotFound",
        type: "error",
      },
      {
        inputs: [],
        name: "Marketplace__ProductNotActive",
        type: "error",
      },
      {
        inputs: [],
        name: "Marketplace__ProductNotFound",
        type: "error",
      },
      {
        inputs: [],
        name: "Marketplace__Unauthorized",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "orderId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "productId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "buyer",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "totalAmount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "escrowId",
            type: "uint256",
          },
        ],
        name: "OrderCreated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "orderId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "enum Marketplace.OrderStatus",
            name: "oldStatus",
            type: "uint8",
          },
          {
            indexed: false,
            internalType: "enum Marketplace.OrderStatus",
            name: "newStatus",
            type: "uint8",
          },
        ],
        name: "OrderStatusChanged",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "productId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            indexed: false,
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
        ],
        name: "ProductCreated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "productId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "seller",
            type: "address",
          },
        ],
        name: "ProductRemoved",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "productId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "newPrice",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "newStock",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
        ],
        name: "ProductUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            indexed: false,
            internalType: "string",
            name: "storeName",
            type: "string",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "registeredAt",
            type: "uint256",
          },
        ],
        name: "SellerRegistered",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "buyerOrders",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_orderId",
            type: "uint256",
          },
        ],
        name: "cancelOrder",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_orderId",
            type: "uint256",
          },
        ],
        name: "confirmOrder",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_productId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_quantity",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "_shippingAddress",
            type: "string",
          },
        ],
        name: "createOrder",
        outputs: [
          {
            internalType: "uint256",
            name: "orderId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "escrowId",
            type: "uint256",
          },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            internalType: "string",
            name: "_description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "_price",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_stock",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "_ipfsHash",
            type: "string",
          },
        ],
        name: "createProduct",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "escrowContract",
        outputs: [
          {
            internalType: "contract Escrow",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "escrowToOrder",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_orderId",
            type: "uint256",
          },
        ],
        name: "fulfillOrder",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "getAllSellers",
        outputs: [
          {
            internalType: "address[]",
            name: "",
            type: "address[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_buyer",
            type: "address",
          },
        ],
        name: "getBuyerOrders",
        outputs: [
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getOrderCount",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getProductCount",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256[]",
            name: "_productIds",
            type: "uint256[]",
          },
        ],
        name: "getProducts",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "seller",
                type: "address",
              },
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "description",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "price",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "stock",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "ipfsHash",
                type: "string",
              },
              {
                internalType: "bool",
                name: "isActive",
                type: "bool",
              },
              {
                internalType: "uint256",
                name: "createdAt",
                type: "uint256",
              },
            ],
            internalType: "struct Marketplace.Product[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_seller",
            type: "address",
          },
        ],
        name: "getSellerOrders",
        outputs: [
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_seller",
            type: "address",
          },
        ],
        name: "getSellerProducts",
        outputs: [
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_addr",
            type: "address",
          },
        ],
        name: "isSeller",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_escrowId",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "releasedToSeller",
            type: "bool",
          },
        ],
        name: "onDisputeResolved",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "orderCounter",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "orders",
        outputs: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "productId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "buyer",
            type: "address",
          },
          {
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "quantity",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalAmount",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "shippingAddress",
            type: "string",
          },
          {
            internalType: "enum Marketplace.OrderStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "escrowId",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "productCounter",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "products",
        outputs: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stock",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_orderId",
            type: "uint256",
          },
        ],
        name: "raiseDispute",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_storeName",
            type: "string",
          },
          {
            internalType: "string",
            name: "_description",
            type: "string",
          },
        ],
        name: "registerSeller",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_productId",
            type: "uint256",
          },
        ],
        name: "removeProduct",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "sellerAddresses",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "sellerOrders",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "sellerProducts",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "sellers",
        outputs: [
          {
            internalType: "address",
            name: "sellerAddress",
            type: "address",
          },
          {
            internalType: "string",
            name: "storeName",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "registeredAt",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address payable",
            name: "_escrow",
            type: "address",
          },
        ],
        name: "setEscrowContract",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_newOwner",
            type: "address",
          },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_productId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_price",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_stock",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "_isActive",
            type: "bool",
          },
        ],
        name: "updateProduct",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  },
} as const;

export default deployedContracts;
