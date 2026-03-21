import { useConnection, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { EscrowAbi } from '@/lib/contracts';
import { useState, useCallback } from 'react';
import { Address } from 'viem';

const ESCROW_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_ADDRESS as Address;

// ============ Types ============

export enum EscrowStatus {
  PENDING = 0,
  RELEASED = 1,
  REFUNDED = 2,
  DISPUTED = 3,
  RESOLVED = 4,
}

export interface EscrowData {
  id: bigint;
  buyer: Address;
  seller: Address;
  amount: bigint;
  productId: bigint;
  status: EscrowStatus;
  createdAt: bigint;
  disputeRaisedAt: bigint;
  resolver: Address;
}

export interface TransactionState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  hash: `0x${string}` | undefined;
  isPending: boolean;
  isConfirming: boolean;
}

// ============ Getter Hooks (Read Operations) ============

export function useEscrowData(escrowId?: bigint) {
  const { data, isLoading, error } = useReadContract({
    address: ESCROW_ADDRESS,
    abi: EscrowAbi,
    functionName: 'getEscrow',
    args: escrowId ? [escrowId] : undefined,
    query: {
      enabled: !!escrowId,
    },
  });

  const escrow = data
    ? {
        id: data[0] as bigint,
        buyer: data[1] as Address,
        seller: data[2] as Address,
        amount: data[3] as bigint,
        productId: data[4] as bigint,
        status: data[5] as EscrowStatus,
        createdAt: data[6] as bigint,
        disputeRaisedAt: data[7] as bigint,
        resolver: data[8] as Address,
      }
    : undefined;

  return { escrow, isLoading, error };
}

export function useBuyerEscrows(buyer?: Address) {
  const { data, isLoading, error } = useReadContract({
    address: ESCROW_ADDRESS,
    abi: EscrowAbi,
    functionName: 'getBuyerEscrows',
    args: buyer ? [buyer] : undefined,
    query: {
      enabled: !!buyer,
    },
  });

  return {
    escrowIds: (data as bigint[] | undefined) || [],
    isLoading,
    error,
  };
}

export function useSellerEscrows(seller?: Address) {
  const { data, isLoading, error } = useReadContract({
    address: ESCROW_ADDRESS,
    abi: EscrowAbi,
    functionName: 'getSellerEscrows',
    args: seller ? [seller] : undefined,
    query: {
      enabled: !!seller,
    },
  });

  return {
    escrowIds: (data as bigint[] | undefined) || [],
    isLoading,
    error,
  };
}

export function useDisputeWindowOpen(escrowId?: bigint) {
  const { data, isLoading, error } = useReadContract({
    address: ESCROW_ADDRESS,
    abi: EscrowAbi,
    functionName: 'isDisputeWindowOpen',
    args: escrowId ? [escrowId] : undefined,
    query: {
      enabled: !!escrowId,
    },
  });

  return {
    isOpen: data as boolean | undefined,
    isLoading,
    error,
  };
}

export function useDisputeTimeRemaining(escrowId?: bigint) {
  const { data, isLoading, error } = useReadContract({
    address: ESCROW_ADDRESS,
    abi: EscrowAbi,
    functionName: 'getDisputeTimeRemaining',
    args: escrowId ? [escrowId] : undefined,
    query: {
      enabled: !!escrowId,
    },
  });

  return {
    remainingSeconds: data as bigint | undefined,
    isLoading,
    error,
  };
}

export function useEscrowOwner() {
  const { data, isLoading, error } = useReadContract({
    address: ESCROW_ADDRESS,
    abi: EscrowAbi,
    functionName: 'owner',
  });

  return {
    owner: data as Address | undefined,
    isLoading,
    error,
  };
}

export function useMarketplaceContract() {
  const { data, isLoading, error } = useReadContract({
    address: ESCROW_ADDRESS,
    abi: EscrowAbi,
    functionName: 'marketplace',
  });

  return {
    marketplace: data as Address | undefined,
    isLoading,
    error,
  };
}

// ============ Setter Hooks (Write Operations) ============

export function useReleasePayment() {
  const [txState, setTxState] = useState<TransactionState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    hash: undefined,
    isPending: false,
    isConfirming: false,
  });

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const releasePayment = useCallback(
    async (escrowId: bigint) => {
      setTxState({ ...txState, isLoading: true, isPending: true });
      try {
        writeContract({
          address: ESCROW_ADDRESS,
          abi: EscrowAbi,
          functionName: 'releasePayment',
          args: [escrowId],
        });
      } catch (err) {
        setTxState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: err as Error,
          hash: undefined,
          isPending: false,
          isConfirming: false,
        });
      }
    },
    [writeContract, txState]
  );

  // Update state based on transaction status
  if (hash && txState.hash !== hash) {
    setTxState({ ...txState, hash, isPending: false, isConfirming: true });
  }

  if (isSuccess && !txState.isSuccess) {
    setTxState({
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
      hash,
      isPending: false,
      isConfirming: false,
    });
  }

  if (error && !txState.isError) {
    setTxState({
      isLoading: false,
      isSuccess: false,
      isError: true,
      error,
      hash,
      isPending: false,
      isConfirming: false,
    });
  }

  return {
    releasePayment,
    ...txState,
    isConfirming,
  };
}

export function useRefund() {
  const [txState, setTxState] = useState<TransactionState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    hash: undefined,
    isPending: false,
    isConfirming: false,
  });

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const refund = useCallback(
    async (escrowId: bigint) => {
      setTxState({ ...txState, isLoading: true, isPending: true });
      try {
        writeContract({
          address: ESCROW_ADDRESS,
          abi: EscrowAbi,
          functionName: 'refund',
          args: [escrowId],
        });
      } catch (err) {
        setTxState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: err as Error,
          hash: undefined,
          isPending: false,
          isConfirming: false,
        });
      }
    },
    [writeContract, txState]
  );

  if (hash && txState.hash !== hash) {
    setTxState({ ...txState, hash, isPending: false, isConfirming: true });
  }

  if (isSuccess && !txState.isSuccess) {
    setTxState({
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
      hash,
      isPending: false,
      isConfirming: false,
    });
  }

  if (error && !txState.isError) {
    setTxState({
      isLoading: false,
      isSuccess: false,
      isError: true,
      error,
      hash,
      isPending: false,
      isConfirming: false,
    });
  }

  return {
    refund,
    ...txState,
    isConfirming,
  };
}

export function useRaiseDispute() {
  const [txState, setTxState] = useState<TransactionState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    hash: undefined,
    isPending: false,
    isConfirming: false,
  });

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const raiseDispute = useCallback(
    async (escrowId: bigint) => {
      setTxState({ ...txState, isLoading: true, isPending: true });
      try {
        writeContract({
          address: ESCROW_ADDRESS,
          abi: EscrowAbi,
          functionName: 'raiseDispute',
          args: [escrowId],
        });
      } catch (err) {
        setTxState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: err as Error,
          hash: undefined,
          isPending: false,
          isConfirming: false,
        });
      }
    },
    [writeContract, txState]
  );

  if (hash && txState.hash !== hash) {
    setTxState({ ...txState, hash, isPending: false, isConfirming: true });
  }

  if (isSuccess && !txState.isSuccess) {
    setTxState({
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
      hash,
      isPending: false,
      isConfirming: false,
    });
  }

  if (error && !txState.isError) {
    setTxState({
      isLoading: false,
      isSuccess: false,
      isError: true,
      error,
      hash,
      isPending: false,
      isConfirming: false,
    });
  }

  return {
    raiseDispute,
    ...txState,
    isConfirming,
  };
}

export function useResolveDispute() {
  const [txState, setTxState] = useState<TransactionState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    hash: undefined,
    isPending: false,
    isConfirming: false,
  });

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const resolveDispute = useCallback(
    async (escrowId: bigint, releaseToSeller: boolean) => {
      setTxState({ ...txState, isLoading: true, isPending: true });
      try {
        writeContract({
          address: ESCROW_ADDRESS,
          abi: EscrowAbi,
          functionName: 'resolveDispute',
          args: [escrowId, releaseToSeller],
        });
      } catch (err) {
        setTxState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: err as Error,
          hash: undefined,
          isPending: false,
          isConfirming: false,
        });
      }
    },
    [writeContract, txState]
  );

  if (hash && txState.hash !== hash) {
    setTxState({ ...txState, hash, isPending: false, isConfirming: true });
  }

  if (isSuccess && !txState.isSuccess) {
    setTxState({
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
      hash,
      isPending: false,
      isConfirming: false,
    });
  }

  if (error && !txState.isError) {
    setTxState({
      isLoading: false,
      isSuccess: false,
      isError: true,
      error,
      hash,
      isPending: false,
      isConfirming: false,
    });
  }

  return {
    resolveDispute,
    ...txState,
    isConfirming,
  };
}

// ============ Combined Hook ============

export function useEscrow() {
  const { address } = useConnection();

  // Getters
  const { escrowIds: buyerEscrowIds } = useBuyerEscrows(address);
  const { escrowIds: sellerEscrowIds } = useSellerEscrows(address);
  const { owner } = useEscrowOwner();
  const isOwner = address && owner ? address === owner : false;

  // Setters
  const releasePaymentTx = useReleasePayment();
  const refundTx = useRefund();
  const raiseDisputeTx = useRaiseDispute();
  const resolveDisputeTx = useResolveDispute();

  return {
    // User data
    address,
    buyerEscrows: buyerEscrowIds,
    sellerEscrows: sellerEscrowIds,
    isOwner,
    owner,

    // Buyer operations
    releasePayment: releasePaymentTx,
    raiseDispute: raiseDisputeTx,

    // Seller operations
    refund: refundTx,

    // Admin operations
    resolveDispute: resolveDisputeTx,
  };
}
