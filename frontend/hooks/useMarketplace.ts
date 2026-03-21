import { useConnection, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MarketplaceAbi } from '@/lib/contracts';
import { useState, useCallback } from 'react';
import { Address, parseEther } from 'viem';

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

export interface Seller {
  sellerAddress: Address;
  storeName: string;
  description: string;
  isActive: boolean;
  registeredAt: bigint;
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

  const seller = data
    ? {
        sellerAddress: data[0] as Address,
        storeName: data[1] as string,
        description: data[2] as string,
        isActive: data[3] as boolean,
        registeredAt: data[4] as bigint,
      }
    : undefined;

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
        id: data[0] as bigint,
        seller: data[1] as Address,
        name: data[2] as string,
        description: data[3] as string,
        price: data[4] as bigint,
        stock: data[5] as bigint,
        ipfsHash: data[6] as string,
        isActive: data[7] as boolean,
        createdAt: data[8] as bigint,
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
        id: data[0] as bigint,
        productId: data[1] as bigint,
        buyer: data[2] as Address,
        seller: data[3] as Address,
        quantity: data[4] as bigint,
        totalAmount: data[5] as bigint,
        shippingAddress: data[6] as string,
        status: data[7] as OrderStatus,
        createdAt: data[8] as bigint,
        escrowId: data[9] as bigint,
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

export function useAllProducts() {
  const { data: productCount, isLoading: countLoading } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MarketplaceAbi,
    functionName: 'getProductCount',
  });

  // Create array of all product IDs (1 to productCount)
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
  const [txState, setTxState] = useState<TransactionState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    hash: undefined,
  });

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const registerSeller = useCallback(
    async (storeName: string, description: string) => {
      setTxState({ ...txState, isLoading: true });
      try {
        writeContract({
          address: MARKETPLACE_ADDRESS,
          abi: MarketplaceAbi,
          functionName: 'registerSeller',
          args: [storeName, description],
        });
      } catch (err) {
        setTxState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: err as Error,
          hash: undefined,
        });
      }
    },
    [writeContract, txState]
  );

  // Update state based on transaction status
  if (hash && txState.hash !== hash) {
    setTxState({ ...txState, hash });
  }

  if (isSuccess && !txState.isSuccess) {
    setTxState({
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
      hash,
    });
  }

  if (error && !txState.isError) {
    setTxState({
      isLoading: false,
      isSuccess: false,
      isError: true,
      error,
      hash,
    });
  }

  return {
    registerSeller,
    ...txState,
    isConfirming,
  };
}

export function useCreateProduct() {
  const [txState, setTxState] = useState<TransactionState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    hash: undefined,
  });

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createProduct = useCallback(
    async (name: string, description: string, price: string, stock: number, ipfsHash: string) => {
      setTxState({ ...txState, isLoading: true });
      try {
        writeContract({
          address: MARKETPLACE_ADDRESS,
          abi: MarketplaceAbi,
          functionName: 'createProduct',
          args: [name, description, parseEther(price), BigInt(stock), ipfsHash],
        });
      } catch (err) {
        setTxState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: err as Error,
          hash: undefined,
        });
      }
    },
    [writeContract, txState]
  );

  if (hash && txState.hash !== hash) {
    setTxState({ ...txState, hash });
  }

  if (isSuccess && !txState.isSuccess) {
    setTxState({
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
      hash,
    });
  }

  if (error && !txState.isError) {
    setTxState({
      isLoading: false,
      isSuccess: false,
      isError: true,
      error,
      hash,
    });
  }

  return {
    createProduct,
    ...txState,
    isConfirming,
  };
}

export function useUpdateProduct() {
  const [txState, setTxState] = useState<TransactionState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    hash: undefined,
  });

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const updateProduct = useCallback(
    async (productId: bigint, price: string, stock: number, isActive: boolean) => {
      setTxState({ ...txState, isLoading: true });
      try {
        writeContract({
          address: MARKETPLACE_ADDRESS,
          abi: MarketplaceAbi,
          functionName: 'updateProduct',
          args: [productId, parseEther(price), BigInt(stock), isActive],
        });
      } catch (err) {
        setTxState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: err as Error,
          hash: undefined,
        });
      }
    },
    [writeContract, txState]
  );

  if (hash && txState.hash !== hash) {
    setTxState({ ...txState, hash });
  }

  if (isSuccess && !txState.isSuccess) {
    setTxState({
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
      hash,
    });
  }

  if (error && !txState.isError) {
    setTxState({
      isLoading: false,
      isSuccess: false,
      isError: true,
      error,
      hash,
    });
  }

  return {
    updateProduct,
    ...txState,
    isConfirming,
  };
}

export function useRemoveProduct() {
  const [txState, setTxState] = useState<TransactionState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    hash: undefined,
  });

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const removeProduct = useCallback(
    async (productId: bigint) => {
      setTxState({ ...txState, isLoading: true });
      try {
        writeContract({
          address: MARKETPLACE_ADDRESS,
          abi: MarketplaceAbi,
          functionName: 'removeProduct',
          args: [productId],
        });
      } catch (err) {
        setTxState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: err as Error,
          hash: undefined,
        });
      }
    },
    [writeContract, txState]
  );

  if (hash && txState.hash !== hash) {
    setTxState({ ...txState, hash });
  }

  if (isSuccess && !txState.isSuccess) {
    setTxState({
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
      hash,
    });
  }

  if (error && !txState.isError) {
    setTxState({
      isLoading: false,
      isSuccess: false,
      isError: true,
      error,
      hash,
    });
  }

  return {
    removeProduct,
    ...txState,
    isConfirming,
  };
}

export function useCreateOrder() {
  const [txState, setTxState] = useState<TransactionState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    hash: undefined,
  });

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createOrder = useCallback(
    async (productId: bigint, quantity: number, shippingAddress: string, totalAmount: bigint) => {
      setTxState({ ...txState, isLoading: true });
      try {
        writeContract({
          address: MARKETPLACE_ADDRESS,
          abi: MarketplaceAbi,
          functionName: 'createOrder',
          args: [productId, BigInt(quantity), shippingAddress],
          value: parseEther(totalAmount),
        });
      } catch (err) {
        setTxState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: err as Error,
          hash: undefined,
        });
      }
    },
    [writeContract, txState]
  );

  if (hash && txState.hash !== hash) {
    setTxState({ ...txState, hash });
  }

  if (isSuccess && !txState.isSuccess) {
    setTxState({
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
      hash,
    });
  }

  if (error && !txState.isError) {
    setTxState({
      isLoading: false,
      isSuccess: false,
      isError: true,
      error,
      hash,
    });
  }

  return {
    createOrder,
    ...txState,
    isConfirming,
  };
}

export function useConfirmOrder() {
  const [txState, setTxState] = useState<TransactionState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    hash: undefined,
  });

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const confirmOrder = useCallback(
    async (orderId: bigint) => {
      setTxState({ ...txState, isLoading: true });
      try {
        writeContract({
          address: MARKETPLACE_ADDRESS,
          abi: MarketplaceAbi,
          functionName: 'confirmOrder',
          args: [orderId],
        });
      } catch (err) {
        setTxState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: err as Error,
          hash: undefined,
        });
      }
    },
    [writeContract, txState]
  );

  if (hash && txState.hash !== hash) {
    setTxState({ ...txState, hash });
  }

  if (isSuccess && !txState.isSuccess) {
    setTxState({
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
      hash,
    });
  }

  if (error && !txState.isError) {
    setTxState({
      isLoading: false,
      isSuccess: false,
      isError: true,
      error,
      hash,
    });
  }

  return {
    confirmOrder,
    ...txState,
    isConfirming,
  };
}

export function useCancelOrder() {
  const [txState, setTxState] = useState<TransactionState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    hash: undefined,
  });

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const cancelOrder = useCallback(
    async (orderId: bigint) => {
      setTxState({ ...txState, isLoading: true });
      try {
        writeContract({
          address: MARKETPLACE_ADDRESS,
          abi: MarketplaceAbi,
          functionName: 'cancelOrder',
          args: [orderId],
        });
      } catch (err) {
        setTxState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: err as Error,
          hash: undefined,
        });
      }
    },
    [writeContract, txState]
  );

  if (hash && txState.hash !== hash) {
    setTxState({ ...txState, hash });
  }

  if (isSuccess && !txState.isSuccess) {
    setTxState({
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
      hash,
    });
  }

  if (error && !txState.isError) {
    setTxState({
      isLoading: false,
      isSuccess: false,
      isError: true,
      error,
      hash,
    });
  }

  return {
    cancelOrder,
    ...txState,
    isConfirming,
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
  const { products: getProduct, isLoading: loadingProduct } = useGetProducts(productIds)
  const { orderIds: buyerOrderIds } = useBuyerOrders(address);
  const { orderIds: sellerOrderIds } = useSellerOrders(address);

  // Setters
  const registerSellerTx = useRegisterSeller();
  const createProductTx = useCreateProduct();
  const updateProductTx = useUpdateProduct();
  const removeProductTx = useRemoveProduct();
  const createOrderTx = useCreateOrder();
  const confirmOrderTx = useConfirmOrder();
  const cancelOrderTx = useCancelOrder();

  return {
    // User data
    address,
    isSeller,
    seller,
    sellerProducts: productIds,
    buyerOrders: buyerOrderIds,
    sellerOrders: sellerOrderIds,
    allProducts, loadingAllProducts,
    getProduct, loadingProduct,
    
    // Seller operations
    registerSeller: registerSellerTx,
    createProduct: createProductTx,
    updateProduct: updateProductTx,
    removeProduct: removeProductTx,
    
    // Buyer operations
    createOrder: createOrderTx,
    confirmOrder: confirmOrderTx,
    cancelOrder: cancelOrderTx,
  };
}
