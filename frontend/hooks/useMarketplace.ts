import { useConnection, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MarketplaceAbi } from '@/lib/contracts';
import { useCallback } from 'react';
import { Address, parseEther } from 'viem';
import { Seller } from '@/types'

const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as Address;

// ============ Types ============

export enum OrderStatus {
  PENDING = 0,
  PAID = 1,
  FULFILLED = 2,
  COMPLETED = 3,
  REFUNDED = 4,
  CANCELLED = 5,
}

export interface Product {
  id: bigint;
  seller: Address;
  name: string;
  description: string;
  price: bigint;
  stock: bigint;
  ipfsHash: string;
  isActive: boolean;
  createdAt: bigint;
}

export interface Order {
  id: bigint;
  productId: bigint;
  buyer: Address;
  seller: Address;
  quantity: bigint;
  totalAmount: bigint;
  shippingAddress: string;
  status: OrderStatus;
  createdAt: bigint;
  escrowId: bigint;
}

export interface TransactionState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  hash: `0x${string}` | undefined;
}

// ============ Getter Hooks (Read Operations) ============

export function useIsSeller(address?: Address) {
  const { data, isLoading, error } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MarketplaceAbi,
    functionName: 'isSeller',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    isSeller: data as boolean | undefined,
    isLoading,
    error,
  };
}

export function useSeller(address?: Address) {
  const { data, isLoading, error } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MarketplaceAbi,
    functionName: 'sellers',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const seller: Seller = data as Seller;

  return { seller, isLoading, error };
}

export function useProduct(productId?: bigint) {
  const { data, isLoading, error } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MarketplaceAbi,
    functionName: 'products',
    args: productId ? [productId] : undefined,
    query: {
      enabled: !!productId,
    },
  });

  const product = data
    ? {
        id: (data as readonly unknown[])[0] as bigint,
        seller: (data as readonly unknown[])[1] as Address,
        name: (data as readonly unknown[])[2] as string,
        description: (data as readonly unknown[])[3] as string,
        price: (data as readonly unknown[])[4] as bigint,
        stock: (data as readonly unknown[])[5] as bigint,
        ipfsHash: (data as readonly unknown[])[6] as string,
        isActive: (data as readonly unknown[])[7] as boolean,
        createdAt: (data as readonly unknown[])[8] as bigint,
      }
    : undefined;

  return { product, isLoading, error };
}

export function useOrder(orderId?: bigint) {
  const { data, isLoading, error } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MarketplaceAbi,
    functionName: 'orders',
    args: orderId ? [orderId] : undefined,
    query: {
      enabled: !!orderId,
    },
  });

  const order = data
    ? {
        id: (data as readonly unknown[])[0] as bigint,
        productId: (data as readonly unknown[])[1] as bigint,
        buyer: (data as readonly unknown[])[2] as Address,
        seller: (data as readonly unknown[])[3] as Address,
        quantity: (data as readonly unknown[])[4] as bigint,
        totalAmount: (data as readonly unknown[])[5] as bigint,
        shippingAddress: (data as readonly unknown[])[6] as string,
        status: (data as readonly unknown[])[7] as OrderStatus,
        createdAt: (data as readonly unknown[])[8] as bigint,
        escrowId: (data as readonly unknown[])[9] as bigint,
      }
    : undefined;

  return { order, isLoading, error };
}

export function useSellerProducts(seller?: Address) {
  const { data, isLoading, error } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MarketplaceAbi,
    functionName: 'getSellerProducts',
    args: seller ? [seller] : undefined,
    query: {
      enabled: !!seller,
    },
  });

  return {
    productIds: (data as bigint[] | undefined) || [],
    isLoading,
    error,
  };
}

export function useBuyerOrders(buyer?: Address) {
  const { data, isLoading, error } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MarketplaceAbi,
    functionName: 'getBuyerOrders',
    args: buyer ? [buyer] : undefined,
    query: {
      enabled: !!buyer,
    },
  });

  return {
    orderIds: (data as bigint[] | undefined) || [],
    isLoading,
    error,
  };
}

export function useSellerOrders(seller?: Address) {
  const { data, isLoading, error } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MarketplaceAbi,
    functionName: 'getSellerOrders',
    args: seller ? [seller] : undefined,
    query: {
      enabled: !!seller,
    },
  });

  return {
    orderIds: (data as bigint[] | undefined) || [],
    isLoading,
    error,
  };
}

export function useProductCount() {
  const { data, isLoading, error } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MarketplaceAbi,
    functionName: 'getProductCount',
  });

  return {
    count: data as bigint | undefined,
    isLoading,
    error,
  };
}

export function useOrderCount() {
  const { data, isLoading, error } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MarketplaceAbi,
    functionName: 'getOrderCount',
  });

  return {
    count: data as bigint | undefined,
    isLoading,
    error,
  };
}

export function useOrderCounter() {
  const { data, isLoading, error } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MarketplaceAbi,
    functionName: 'orderCounter',
  });

  return {
    orderCounter: data as bigint | undefined,
    isLoading,
    error,
  };
}

export function useProductCounter() {
  const { data, isLoading, error } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MarketplaceAbi,
    functionName: 'productCounter',
  });

  return {
    productCounter: data as bigint | undefined,
    isLoading,
    error,
  };
}

export function useEscrowContract() {
  const { data, isLoading, error } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MarketplaceAbi,
    functionName: 'escrowContract',
  });

  return {
    escrowContract: data as Address | undefined,
    isLoading,
    error,
  };
}

export function useMarketplaceOwner() {
  const { data, isLoading, error } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MarketplaceAbi,
    functionName: 'owner',
  });

  return {
    owner: data as Address | undefined,
    isLoading,
    error,
  };
}

export function useAllProducts() {
  const { data: productCount, isLoading: countLoading } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MarketplaceAbi,
    functionName: 'getProductCount',
  });

  const allProductIds = productCount
    ? Array.from({ length: Number(productCount) }, (_, i) => BigInt(i + 1))
    : [];

  const { data, isLoading: productsLoading, error } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MarketplaceAbi,
    functionName: 'getProducts',
    args: allProductIds.length > 0 ? [allProductIds] : undefined,
    query: {
      enabled: allProductIds.length > 0 && !countLoading,
    },
  });

  const products = (data as Product[] | undefined) || [];

  return { products, isLoading: countLoading || productsLoading, error };
}

export function useGetProducts(productIds: bigint[]) {
  const { data, isLoading, error } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MarketplaceAbi,
    functionName: 'getProducts',
    args: productIds.length > 0 ? [productIds] : undefined,
    query: {
      enabled: productIds.length > 0,
    },
  });

  const products = (data as Product[] | undefined) || [];

  return { products, isLoading, error };
}

// ============ Setter Hooks (Write Operations) ============

export function useRegisterSeller() {
  const { mutate, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const registerSeller = useCallback(
    (storeName: string, description: string) => {
      mutate({
        address: MARKETPLACE_ADDRESS,
        abi: MarketplaceAbi,
        functionName: 'registerSeller',
        args: [storeName, description],
      });
    },
    [mutate]
  );

  return {
    registerSeller,
    isLoading: isPending,
    isConfirming,
    isSuccess,
    isError: !!error,
    error,
    hash,
  };
}

export function useCreateProduct() {
  const { mutate, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createProduct = useCallback(
    (name: string, description: string, price: string, stock: number, ipfsHash: string) => {
      mutate({
        address: MARKETPLACE_ADDRESS,
        abi: MarketplaceAbi,
        functionName: 'createProduct',
        args: [name, description, parseEther(price), BigInt(stock), ipfsHash],
      });
    },
    [mutate]
  );

  return {
    createProduct,
    isLoading: isPending,
    isConfirming,
    isSuccess,
    isError: !!error,
    error,
    hash,
  };
}

export function useUpdateProduct() {
  const { mutate, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const updateProduct = useCallback(
    (productId: bigint, price: string, stock: number, isActive: boolean) => {
      mutate({
        address: MARKETPLACE_ADDRESS,
        abi: MarketplaceAbi,
        functionName: 'updateProduct',
        args: [productId, parseEther(price), BigInt(stock), isActive],
      });
    },
    [mutate]
  );

  return {
    updateProduct,
    isLoading: isPending,
    isConfirming,
    isSuccess,
    isError: !!error,
    error,
    hash,
  };
}

export function useRemoveProduct() {
  const { mutate, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const removeProduct = useCallback(
    (productId: bigint) => {
      mutate({
        address: MARKETPLACE_ADDRESS,
        abi: MarketplaceAbi,
        functionName: 'removeProduct',
        args: [productId],
      });
    },
    [mutate]
  );

  return {
    removeProduct,
    isLoading: isPending,
    isConfirming,
    isSuccess,
    isError: !!error,
    error,
    hash,
  };
}

export function useCreateOrder() {
  const { mutate, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createOrder = useCallback(
    (productId: bigint, quantity: number, shippingAddress: string, totalAmount: bigint) => {
      mutate({
        address: MARKETPLACE_ADDRESS,
        abi: MarketplaceAbi,
        functionName: 'createOrder',
        args: [productId, BigInt(quantity), shippingAddress],
        value: totalAmount,
      });
    },
    [mutate]
  );

  return {
    createOrder,
    isLoading: isPending,
    isConfirming,
    isSuccess,
    isError: !!error,
    error,
    hash,
  };
}

export function useConfirmOrder() {
  const { mutate, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const confirmOrder = useCallback(
    (orderId: bigint) => {
      mutate({
        address: MARKETPLACE_ADDRESS,
        abi: MarketplaceAbi,
        functionName: 'confirmOrder',
        args: [orderId],
      });
    },
    [mutate]
  );

  return {
    confirmOrder,
    isLoading: isPending,
    isConfirming,
    isSuccess,
    isError: !!error,
    error,
    hash,
  };
}

export function useCancelOrder() {
  const { mutate, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const cancelOrder = useCallback(
    (orderId: bigint) => {
      mutate({
        address: MARKETPLACE_ADDRESS,
        abi: MarketplaceAbi,
        functionName: 'cancelOrder',
        args: [orderId],
      });
    },
    [mutate]
  );

  return {
    cancelOrder,
    isLoading: isPending,
    isConfirming,
    isSuccess,
    isError: !!error,
    error,
    hash,
  };
}

export function useSetMarketplaceEscrowContract() {
  const { mutate, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const setEscrowContract = useCallback(
    (escrowAddress: Address) => {
      mutate({
        address: MARKETPLACE_ADDRESS,
        abi: MarketplaceAbi,
        functionName: 'setEscrowContract',
        args: [escrowAddress],
      });
    },
    [mutate]
  );

  return {
    setEscrowContract,
    isLoading: isPending,
    isConfirming,
    isSuccess,
    isError: !!error,
    error,
    hash,
  };
}

export function useTransferMarketplaceOwnership() {
  const { mutate, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const transferOwnership = useCallback(
    (newOwner: Address) => {
      mutate({
        address: MARKETPLACE_ADDRESS,
        abi: MarketplaceAbi,
        functionName: 'transferOwnership',
        args: [newOwner],
      });
    },
    [mutate]
  );

  return {
    transferOwnership,
    isLoading: isPending,
    isConfirming,
    isSuccess,
    isError: !!error,
    error,
    hash,
  };
}

// ============ Combined Hook ============

export function useMarketplace() {
  const { address } = useConnection();

  // Getters
  const { isSeller } = useIsSeller(address);
  const { seller } = useSeller(address);
  const { productIds } = useSellerProducts(address);
  const { products: allProducts, isLoading: loadingAllProducts } = useAllProducts();
  const { products: sellerProductDetails, isLoading: loadingSellerProducts } = useGetProducts(productIds);
  const { orderIds: buyerOrderIds } = useBuyerOrders(address);
  const { orderIds: sellerOrderIds } = useSellerOrders(address);
  
  // Admin getters
  const { orderCounter } = useOrderCounter();
  const { productCounter } = useProductCounter();
  const { escrowContract } = useEscrowContract();
  const { owner: marketplaceOwner } = useMarketplaceOwner();

  // Setters
  const registerSellerTx = useRegisterSeller();
  const createProductTx = useCreateProduct();
  const updateProductTx = useUpdateProduct();
  const removeProductTx = useRemoveProduct();
  const createOrderTx = useCreateOrder();
  const confirmOrderTx = useConfirmOrder();
  const cancelOrderTx = useCancelOrder();
  
  // Admin setters
  const setEscrowContractTx = useSetMarketplaceEscrowContract();
  const transferOwnershipTx = useTransferMarketplaceOwnership();

  return {
    // User data
    address,
    isSeller,
    seller,
    sellerProducts: productIds,
    sellerProductDetails,
    loadingSellerProducts,
    buyerOrders: buyerOrderIds,
    sellerOrders: sellerOrderIds,
    allProducts,
    loadingAllProducts,

    // Seller operations
    registerSeller: registerSellerTx,
    createProduct: createProductTx,
    updateProduct: updateProductTx,
    removeProduct: removeProductTx,

    // Buyer operations
    createOrder: createOrderTx,
    confirmOrder: confirmOrderTx,
    cancelOrder: cancelOrderTx,
    
    // Admin operations
    orderCounter,
    productCounter,
    escrowContract,
    marketplaceOwner,
    setEscrowContract: setEscrowContractTx,
    transferOwnership: transferOwnershipTx,
  };
}