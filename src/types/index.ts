// User Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  cpf: string;
  address: Address;
  subscriptionStatus: SubscriptionStatus;
  commissionBalance: number;
  tier: MembershipTier;
  referralCode: string;
  referredBy?: string;
  activeReferrals: number;
  nextPaymentDate?: Date;
  createdAt: Date;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
}

export enum MembershipTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  scientificReferences?: string[];
  usage: string;
  dosage: string;
  contraindications?: string[];
  warnings?: string[];
  images: string[];
  price: number;
  discountPrice?: number;
  categories: string[];
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount?: number;
  shipping?: number;
  total: number;
  appliedCoupon?: Coupon;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount?: number;
  shipping?: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  appliedCoupon?: Coupon;
  billingAddress: Address;
  shippingAddress: Address;
  createdAt: Date;
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  BOLETO = 'boleto',
  PIX = 'pix',
  COMMISSION_BALANCE = 'commission_balance',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum DeliveryStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  discount: number;
  isPercentage: boolean;
  validUntil: Date;
  minimumPurchase?: number;
  isActive: boolean;
  createdAt: Date;
}

// Commission Types
export interface Commission {
  id: string;
  userId: string;
  referralId: string;
  amount: number;
  status: CommissionStatus;
  releaseDate: Date;
  createdAt: Date;
  paidAt?: Date;
}

export enum CommissionStatus {
  PENDING = 'pending',
  AVAILABLE = 'available',
  PAID = 'paid',
}

// Payment Types
export interface PaymentMethodInfo {
  id: string;
  userId: string;
  type: PaymentMethodType;
  isDefault: boolean;
  details: CreditCardDetails | BankAccountDetails | PixDetails;
  createdAt: Date;
}

export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  BANK_ACCOUNT = 'bank_account',
  PIX = 'pix',
}

export interface CreditCardDetails {
  cardholderName: string;
  lastFourDigits: string;
  expiryMonth: string;
  expiryYear: string;
  brand: string;
}

export interface BankAccountDetails {
  bankName: string;
  accountType: string;
  accountNumber: string;
  branchNumber: string;
  accountHolderName: string;
  accountHolderDocument: string;
}

export interface PixDetails {
  key: string;
  keyType: PixKeyType;
}

export enum PixKeyType {
  CPF = 'cpf',
  CNPJ = 'cnpj',
  EMAIL = 'email',
  PHONE = 'phone',
  RANDOM = 'random',
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  data?: any;
  createdAt: Date;
}

export enum NotificationType {
  NEW_REFERRAL = 'new_referral',
  REFERRAL_ACTIVE = 'referral_active',
  REFERRAL_INACTIVE = 'referral_inactive',
  SUBSCRIPTION_REMINDER = 'subscription_reminder',
  NEW_COUPON = 'new_coupon',
  PROMOTION = 'promotion',
  ORDER_STATUS = 'order_status',
  COMMISSION_AVAILABLE = 'commission_available',
}

// Authentication State
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// App Navigation Params
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
  ProductDetails: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
  OrderDetails: { orderId: string };
  UserProfile: undefined;
  EditProfile: undefined;
  PaymentMethods: undefined;
  AddPaymentMethod: undefined;
  Subscriptions: undefined;
  Commissions: undefined;
  WithdrawCommission: undefined;
  Referrals: undefined;
  Coupons: undefined;
  Help: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Store: undefined;
  Referrals: undefined;
  Profile: undefined;
};
