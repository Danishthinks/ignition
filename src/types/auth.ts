export type UserRole = 'driver' | 'admin';

export type SubscriptionTier = 'free' | 'pro';

export type SubscriptionPlan = 'monthly' | 'quarterly' | 'annual' | 'lifetime';

export type SubscriptionStatus = 'active' | 'pending' | 'rejected' | 'expired';

export interface SubscriptionDetails {
  tier: SubscriptionTier;
  planName: SubscriptionPlan;
  amountPaid: number; // in PKR (e.g. 100, 250, 800, 999)
  subscribedAt: string;
  expiresAt: string; // ISO string or 'lifetime'
  paymentMethod: 'nayapay' | 'raast' | 'easypaisa' | 'jazzcash' | 'creator_grant' | 'vip_pass';
  trxId: string;
  senderPhone?: string;
  senderName?: string;
  status: SubscriptionStatus;
  rejectionReason?: string;
  verifiedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  targetCarName?: string;
  startingBalance?: number;
  subscription?: SubscriptionDetails;
}
