import { Address } from 'viem';

// ============ Contract Types ============

export interface Product {
  id: bigint;
  seller: Address;
  name: string;
  description: string;
  price: bigint;
  stock: bigint;
  isActive: boolean;
  createdAt: bigint;
  ipfsHash: string;
}

export interface Order {
  id: bigint;
  buyer: Address;
  seller: Address;
  productId: bigint;
  quantity: bigint;
  totalAmount: bigint;
  status: OrderStatus;
  createdAt: bigint;
  escrowId: bigint;
  shippingAddress: string;
}

export interface Seller {
  address: Address;
  storeName: string;
  storeDescription: string;
  isActive: boolean;
  createdAt: bigint;
}

export interface Escrow {
  id: bigint;
  buyer: Address;
  seller: Address;
  amount: bigint;
  status: EscrowStatus;
  createdAt: bigint;
  disputeRaised: boolean;
}

// ============ Enums ============

export enum OrderStatus {
  Pending = 0,
  Paid = 1,
  Fulfilled = 2,
  Completed = 3,
  Refunded = 4,
  Cancelled = 5,
}

export enum EscrowStatus {
  Pending = 0,
  Paid = 1,
  Disputed = 2,
  Resolved = 3,
  Refunded = 4,
}

// ============ Transaction Types ============

export interface TransactionState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  hash: `0x${string}` | undefined;
}

export interface WriteTransactionState extends TransactionState {
  isPending: boolean;
  isConfirming: boolean;
}

// ============ Form Types ============

export interface RegisterSellerForm {
  storeName: string;
  storeDescription: string;
}

export interface CreateProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  ipfsHash: string;
}

export interface CreateOrderForm {
  productId: bigint;
  quantity: number;
  shippingAddress: string;
  totalAmount: bigint
}

export interface DisputeForm {
  reason: string;
  description: string;
}

// ============ UI Component Props ============

export interface ProductCardProps {
  product: Product;
  showSeller?: boolean;
  showActions?: boolean;
  onViewDetails?: (productId: bigint) => void;
}

export interface OrderCardProps {
  order: Order;
  isBuyer: boolean;
  onAction: (order: Order, action: OrderAction) => void;
}

export type OrderAction = 'confirm' | 'cancel' | 'dispute' | 'refund';

export interface ConnectWalletProps {
  className?: string;
  showAddress?: boolean;
  showEmail?: boolean;
}

export interface NavbarProps {
  userRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

export type UserRole = 'buyer' | 'seller' | 'admin';

// ============ API Response Types ============

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

// ============ Filter & Search Types ============

export interface ProductFilters {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  seller?: Address;
  inStock?: boolean;
  sortBy?: ProductSortBy;
  sortOrder?: 'asc' | 'desc';
}

export type ProductSortBy = 'name' | 'price' | 'createdAt' | 'stock';

export interface SearchParams {
  query?: string;
  filters?: ProductFilters;
  page?: number;
  limit?: number;
}

// ============ Cart Types ============

export interface CartItem {
  productId: bigint;
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  totalAmount: bigint;
  totalItems: number;
  updatedAt: Date;
}

// ============ Notification Types ============

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export enum NotificationType {
  OrderCreated = 'order_created',
  OrderPaid = 'order_paid',
  OrderFulfilled = 'order_fulfilled',
  OrderCompleted = 'order_completed',
  OrderCancelled = 'order_cancelled',
  DisputeRaised = 'dispute_raised',
  ProductCreated = 'product_created',
  ProductUpdated = 'product_updated',
  LowStock = 'low_stock',
}

// ============ User Profile Types ============

export interface UserProfile {
  address: Address;
  email?: string;
  username?: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  lastActiveAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  orderUpdates: boolean;
  priceAlerts: boolean;
  marketing: boolean;
}

// ============ Statistics Types ============

export interface SellerStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  completedOrders: number;
  totalRevenue: bigint;
  averageRating: number;
  totalReviews: number;
}

export interface BuyerStats {
  totalOrders: number;
  completedOrders: number;
  totalSpent: bigint;
  averageOrderValue: bigint;
  savedItems: number;
}

// ============ Review Types ============

export interface Review {
  id: bigint;
  orderId: bigint;
  productId: bigint;
  reviewer: Address;
  seller: Address;
  rating: number;
  comment: string;
  createdAt: bigint;
  helpful: number;
}

export interface CreateReviewForm {
  rating: number;
  comment: string;
}

// ============ Category Types ============

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  productCount: number;
  isActive: boolean;
}

// ============ Error Types ============

export interface ContractError extends Error {
  code: string;
  functionName: string;
  args?: unknown[];
}

export interface ValidationError extends Error {
  field: string;
  value: unknown;
}

// ============ Configuration Types ============

export interface AppConfig {
  network: {
    name: string;
    chainId: number;
    rpcUrl: string;
    blockExplorerUrl: string;
  };
  contracts: {
    marketplace: Address;
    escrow: Address;
  };
  features: {
    enableDisputes: boolean;
    enableReviews: boolean;
    enableNotifications: boolean;
  };
}

// ============ Utility Types ============

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type AddressLike = string | Address;
export type BigIntLike = bigint | string | number;