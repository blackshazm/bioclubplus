export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: {
    name: string;
    price: number;
    billingFrequency: string;
    description: string;
  };
  status: 'active' | 'pending' | 'trial' | 'canceled' | 'expired';
  createdAt: Date;
  nextBillingDate: Date;
  canceledAt?: Date;
  cancelReason?: string;
  paymentMethod: {
    type: string;
    lastFour?: string;
    lastUpdated: Date;
    [key: string]: any;
  };
}

export interface SubscriptionState {
  subscription: Subscription | null;
  subscriptionHistory: Subscription[];
  isLoading: boolean;
  error: string | null;
}
