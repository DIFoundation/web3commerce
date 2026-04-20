"use client";

import { useState, useCallback } from "react";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import type { Address } from "viem";
import deployedContracts from "@/contracts/deployedContracts";

// ─── Hook ────────────────────────────────────────────────────────────────────
 
/**
 * useEscrow
 *
 * A complete wagmi hook for the Escrow contract.
 *
 * @example
 * const {
 *   reads: { useEscrow, useDisputeTimeRemaining, useIsDisputeWindowOpen },
 *   writes: { releasePayment, raiseDispute, resolveDispute },
 *   tx,
 * } = useEscrow("0xYourEscrowAddress");
 */

const contract = deployedContracts.Escrow;

export function useEscrow() {
  const { writeContractAsync } = useWriteContract();
  const [pendingTxHash, setPendingTxHash] = useState<`0x${string}` | undefined>();
 
  const { isLoading: isTxPending, isSuccess: isTxSuccess } =
    useWaitForTransactionReceipt({ hash: pendingTxHash });
 
  // Helper: write + track tx
  const send = useCallback(
    async (functionName: string, args: unknown[], value?: bigint) => {
      const hash = await writeContractAsync({
        address: contract.address,
        abi: contract.abi,
        functionName: functionName as never,
        args: args as never,
        ...(value !== undefined ? { value } : {}),
      });
      setPendingTxHash(hash);
      return hash;
    },
    [writeContractAsync]
  );
 
  // ── Read hooks ─────────────────────────────────────────────────────────────
 
  /** Dispute window duration in seconds */
  const useDisputeWindow = () =>
    useReadContract({
      address: contract.address,
      abi: contract.abi,
      functionName: "DISPUTE_WINDOW",
    });
 
  /** Auction contract address */
  const useAuctionContract = () =>
    useReadContract({
      address: contract.address,
      abi: contract.abi,
      functionName: "auctionContract",
    });
 
  /** Marketplace contract address */
  const useMarketplace = () =>
    useReadContract({
      address: contract.address,
      abi: contract.abi,
      functionName: "marketplace",
    });
 
  /** Contract owner address */
  const useOwner = () =>
    useReadContract({
      address: contract.address,
      abi: contract.abi,
      functionName: "owner",
    });
 
  /** Total number of escrows created */
  const useEscrowCounter = () =>
    useReadContract({
      address: contract.address,
      abi: contract.abi,
      functionName: "escrowCounter",
    });
 
  /** Full EscrowData struct for a given escrow ID */
  const useEscrowById = (escrowId: bigint) =>
    useReadContract({
      address: contract.address,
      abi: contract.abi,
      functionName: "getEscrow",
      args: [escrowId],
    });
 
  /** Raw escrows mapping entry (same fields as getEscrow, no struct wrapping) */
  const useEscrowRaw = (escrowId: bigint) =>
    useReadContract({
      address: contract.address,
      abi: contract.abi,
      functionName: "escrows",
      args: [escrowId],
    });
 
  /** All escrow IDs for a buyer */
  const useBuyerEscrows = (buyer: Address) =>
    useReadContract({
      address: contract.address,
      abi: contract.abi,
      functionName: "getBuyerEscrows",
      args: [buyer],
      query: { enabled: Boolean(buyer) },
    });
 
  /** All escrow IDs for a seller */
  const useSellerEscrows = (seller: Address) =>
    useReadContract({
      address: contract.address,
      abi: contract.abi,
      functionName: "getSellerEscrows",
      args: [seller],
      query: { enabled: Boolean(seller) },
    });
 
  /**
   * Seconds remaining in the dispute window for a given escrow.
   * Returns 0 if window has closed or no dispute was raised.
   */
  const useDisputeTimeRemaining = (escrowId: bigint) =>
    useReadContract({
      address: contract.address,
      abi: contract.abi,
      functionName: "getDisputeTimeRemaining",
      args: [escrowId],
    });
 
  /** Whether the dispute window is still open for an escrow */
  const useIsDisputeWindowOpen = (escrowId: bigint) =>
    useReadContract({
      address: contract.address,
      abi: contract.abi,
      functionName: "isDisputeWindowOpen",
      args: [escrowId],
    });
 
  // ── Write functions ────────────────────────────────────────────────────────
 
  /**
   * Create a new escrow, funding it with ETH.
   * Typically called by the Marketplace contract, not directly by users.
   *
   * @param value - ETH amount to lock in the escrow (in wei)
   */
  const createEscrow = useCallback(
    (params: {
      buyer: Address;
      seller: Address;
      productId: bigint;
      orderId: bigint;
      value: bigint;
    }) =>
      send(
        "createEscrow",
        [params.buyer, params.seller, params.productId, params.orderId],
        params.value
      ),
    [send]
  );
 
  /**
   * Release escrowed funds to the seller.
   * Called by the buyer (or marketplace) after confirming receipt.
   */
  const releasePayment = useCallback(
    (escrowId: bigint) => send("releasePayment", [escrowId]),
    [send]
  );
 
  /**
   * Refund escrowed funds back to the buyer.
   * Called when an order is cancelled before fulfilment.
   */
  const refund = useCallback(
    (escrowId: bigint) => send("refund", [escrowId]),
    [send]
  );
 
  /**
   * Raise a dispute on an active escrow within the dispute window.
   */
  const raiseDispute = useCallback(
    (escrowId: bigint) => send("raiseDispute", [escrowId]),
    [send]
  );
 
  /**
   * Resolve a raised dispute (owner / resolver only).
   *
   * @param releaseToSeller - true → funds go to seller; false → refund to buyer
   */
  const resolveDispute = useCallback(
    (escrowId: bigint, releaseToSeller: boolean) =>
      send("resolveDispute", [escrowId, releaseToSeller]),
    [send]
  );
 
  /**
   * Emergency withdrawal of any ETH in the contract (owner only).
   */
  const emergencyWithdraw = useCallback(
    (to: Address, amount: bigint) => send("emergencyWithdraw", [to, amount]),
    [send]
  );
 
  /**
   * Point the escrow at a marketplace contract (owner only, one-time).
   */
  const setMarketplace = useCallback(
    (marketplace: Address) => send("setMarketplace", [marketplace]),
    [send]
  );
 
  /**
   * Point the escrow at an auction contract (owner only, one-time).
   */
  const setAuctionContract = useCallback(
    (auction: Address) => send("setAuctionContract", [auction]),
    [send]
  );
 
  /**
   * Transfer contract ownership (owner only).
   */
  const transferOwnership = useCallback(
    (newOwner: Address) => send("transferOwnership", [newOwner]),
    [send]
  );
 
  // ── Return ─────────────────────────────────────────────────────────────────
 
  return {
    /** Read hooks — call these inside your component */
    reads: {
      useDisputeWindow,
      useAuctionContract,
      useMarketplace,
      useOwner,
      useEscrowCounter,
      useEscrowById,       // uses getEscrow (returns full struct)
      useEscrowRaw,        // uses escrows mapping directly
      useBuyerEscrows,
      useSellerEscrows,
      useDisputeTimeRemaining,
      useIsDisputeWindowOpen,
    },
 
    /** Write functions — async, return tx hash */
    writes: {
      createEscrow,
      releasePayment,
      refund,
      raiseDispute,
      resolveDispute,
      emergencyWithdraw,
      setMarketplace,
      setAuctionContract,
      transferOwnership,
    },
 
    /** Transaction state for the most recently sent write */
    tx: {
      hash: pendingTxHash,
      isPending: isTxPending,
      isSuccess: isTxSuccess,
    },
  };
}
