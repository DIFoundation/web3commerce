import { useConnection, useBalance, useChainId } from 'wagmi';
import { useMarketplace } from './useMarketplace';
import { useEscrow } from './useEscrow';

/**
 * @title useContract
 * @notice Combined hook for all contract interactions
 * @dev Provides access to both Marketplace and Escrow functionality
 */
export function useContract() {
  const { address, isConnected } = useConnection();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });

  const marketplace = useMarketplace();
  const escrow = useEscrow();

  return {
    // Wallet info
    address,
    isConnected,
    chainId,
    balance: balance ? balance.formatted : '0',
    nativeCurrency: balance?.symbol,

    // Marketplace
    marketplace: {
      // User status
      isSeller: marketplace.isSeller,
      seller: marketplace.seller,

      // Products
      sellerProducts: marketplace.sellerProducts,
      allProducts: marketplace.allProducts,

      // Orders
      buyerOrders: marketplace.buyerOrders,
      sellerOrders: marketplace.sellerOrders,

      // Operations
      registerSeller: marketplace.registerSeller,
      createProduct: marketplace.createProduct,
      updateProduct: marketplace.updateProduct,
      removeProduct: marketplace.removeProduct,
      createOrder: marketplace.createOrder,
      confirmOrder: marketplace.confirmOrder,
      cancelOrder: marketplace.cancelOrder,
    },

    // Escrow
    escrow: {
      // User escrows
      buyerEscrows: escrow.buyerEscrows,
      sellerEscrows: escrow.sellerEscrows,
      isOwner: escrow.isOwner,

      // Operations
      releasePayment: escrow.releasePayment,
      refund: escrow.refund,
      raiseDispute: escrow.raiseDispute,
      resolveDispute: escrow.resolveDispute,
    },
  };
}
