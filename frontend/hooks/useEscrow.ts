import { useConnection, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { EscrowAbi } from '@/lib/contracts';
import { useCallback } from 'react';
import { Address, BaseError } from 'viem';

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

  // FIX: getEscrow returns a typed tuple struct, not an indexed array.
  // Access fields by name, not by numeric index.
  const escrow = data
    ? {
        id: (data as readonly unknown[])[0] as bigint,
        buyer: (data as readonly unknown[])[1] as Address,
        seller: (data as readonly unknown[])[2] as Address,
        amount: (data as readonly unknown[])[3] as bigint,
        productId: (data as readonly unknown[])[4] as bigint,
        status: (data as readonly unknown[])[5] as EscrowStatus,
        createdAt: (data as readonly unknown[])[6] as bigint,
        disputeRaisedAt: (data as readonly unknown[])[7] as bigint,
        resolver: (data as readonly unknown[])[8] as Address,
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

export function useDisputeWindowDuration() {
  const { data, isLoading, error } = useReadContract({
    address: ESCROW_ADDRESS,
    abi: EscrowAbi,
    functionName: 'DISPUTE_WINDOW',
  });

  return {
    disputeWindow: data as bigint | undefined,
    isLoading,
    error,
  };
}

export function useMarketplaceAddress() {
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
  const { mutate, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const releasePayment = useCallback(
    (escrowId: bigint) => {
      mutate({
        address: ESCROW_ADDRESS,
        abi: EscrowAbi,
        functionName: 'releasePayment',
        args: [escrowId],
      });
    },
    [mutate]
  );

  return {
    releasePayment,
    isLoading: isPending,
    isConfirming,
    isSuccess,
    isError: !!error,
    error,
    hash,
  };
}

export function useRefund() {
  const { mutate, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const refund = useCallback(
    (escrowId: bigint) => {
      mutate({
        address: ESCROW_ADDRESS,
        abi: EscrowAbi,
        functionName: 'refund',
        args: [escrowId],
      });
    },
    [mutate]
  );

  return {
    refund,
    isLoading: isPending,
    isConfirming,
    isSuccess,
    isError: !!error,
    error,
    hash,
  };
}

export function useRaiseDispute() {
  const { mutate, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const raiseDispute = useCallback(
    (escrowId: bigint) => {
      mutate({
        address: ESCROW_ADDRESS,
        abi: EscrowAbi,
        functionName: 'raiseDispute',
        args: [escrowId],
      });
    },
    [mutate]
  );

  return {
    raiseDispute,
    isLoading: isPending,
    isConfirming,
    isSuccess,
    isError: !!error,
    error,
    hash,
  };
}

export function useResolveDispute() {
  const { mutate, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const resolveDispute = useCallback(
    (escrowId: bigint, releaseToSeller: boolean) => {
      mutate({
        address: ESCROW_ADDRESS,
        abi: EscrowAbi,
        functionName: 'resolveDispute',
        args: [escrowId, releaseToSeller],
      });
    },
    [mutate]
  );

  return {
    resolveDispute,
    isLoading: isPending,
    isConfirming,
    isSuccess,
    isError: !!error,
    error,
    hash,
  };
}

export function useEmergencyWithdraw() {
  const { mutate, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({hash});

  const emergencyWithdraw = useCallback(
    (to: Address, amount: bigint) => {
      mutate({
        address: ESCROW_ADDRESS,
        abi: EscrowAbi,
        functionName: 'emergencyWithdraw',
        args: [to, amount],
      });
    },
    [mutate]
  );

  return{
    emergencyWithdraw,
    isLoading: isPending,
    isConfirming,
    isSuccess,
    isError: !!error,
    error,
    hash,
  };
}

export function useCreateEscrow() {
  const { mutate, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createEscrow = useCallback(
    (buyer: Address, seller: Address, productId: bigint, amount: bigint) => {
      mutate({
        address: ESCROW_ADDRESS,
        abi: EscrowAbi,
        functionName: 'createEscrow',
        args: [buyer, seller, productId],
        value: amount,
      });
    },
    [mutate]
  );

  return {
    createEscrow,
    isLoading: isPending,
    isConfirming,
    isSuccess,
    isError: !!error,
    error,
    hash,
  };
}

export function useSetEscrowMarketplace() {
  const { mutate, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const setMarketplace = useCallback(
    (marketplaceAddress: Address) => {
      mutate({
        address: ESCROW_ADDRESS,
        abi: EscrowAbi,
        functionName: 'setMarketplace',
        args: [marketplaceAddress],
      });
    },
    [mutate]
  );

  return {
    setMarketplace,
    isLoading: isPending,
    isConfirming,
    isSuccess,
    isError: !!error,
    error,
    hash,
  };
}

export function useTransferEscrowOwnership() {
  const { mutate, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const transferOwnership = useCallback(
    (newOwner: Address) => {
      mutate({
        address: ESCROW_ADDRESS,
        abi: EscrowAbi,
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

// ============ Escrow Counter Hook ============

export function useEscrowCounter() {
  const { data: escrowCounter, error, isLoading } = useReadContract({
    address: ESCROW_ADDRESS,
    abi: EscrowAbi,
    functionName: 'escrowCounter',
  });

  return {
    escrowCounter,
    isLoading,
    error: error ? (error as BaseError) : null,
  };
}

// ============ Set Escrow Contract Hook ============

export function useSetEscrowContract() {
  const { mutate, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({hash});

  const setEscrowContract = useCallback(
    (newEscrowAddress: Address) => {
      mutate({
        address: ESCROW_ADDRESS,
        abi: EscrowAbi,
        functionName: 'setEscrowContract',
        args: [newEscrowAddress],
      });
    },
    [mutate]
  );

  return{
    setEscrowContract,
    isLoading: isPending,
    isConfirming,
    isSuccess,
    isError: !!error,
    error,
    hash,
  };
}

// ============ Combined Hook ============

export function useEscrow() {
  const { address } = useConnection();

  // Getters
  const { escrowIds: buyerEscrowIds } = useBuyerEscrows(address);
  const { escrowIds: sellerEscrowIds } = useSellerEscrows(address);
  const { owner } = useEscrowOwner();
  const isOwner = address && owner ? address.toLowerCase() === owner.toLowerCase() : false;

  // Setters
  const releasePaymentTx = useReleasePayment();
  const refundTx = useRefund();
  const raiseDisputeTx = useRaiseDispute();
  const { resolveDispute } = useResolveDispute();
  const { emergencyWithdraw } = useEmergencyWithdraw();
  const { escrowCounter } = useEscrowCounter();
  const { setEscrowContract } = useSetEscrowContract();
  
  // Additional getters
  const { disputeWindow } = useDisputeWindowDuration();
  const { marketplace } = useMarketplaceAddress();
  
  // Admin setters
  const createEscrowTx = useCreateEscrow();
  const { setMarketplace: setMarketplaceTx } = useSetEscrowMarketplace();
  const { transferOwnership: transferOwnershipTx } = useTransferEscrowOwnership();

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
    resolveDispute,
    emergencyWithdraw,
    setEscrowContract,
    escrowCounter,
    disputeWindow,
    marketplace,
    createEscrow: createEscrowTx,
    setMarketplace: setMarketplaceTx,
    transferOwnership: transferOwnershipTx,
  };
}