export interface Referral {
  id: string;
  referrerId: string; // ID do usuário que fez a indicação
  referredId: string; // ID do usuário indicado
  referredName: string; // Nome do usuário indicado
  referredEmail: string;
  status: 'pending' | 'active' | 'inactive';
  createdAt: Date;
}

export interface Commission {
  id: string;
  referralId: string;
  referrerId: string;
  referredId: string;
  amount: number;
  status: 'pending' | 'available' | 'paid';
  paidAt?: Date;
  createdAt: Date;
}

export interface ReferralState {
  referrals: Referral[];
  commissions: Commission[];
  referralLink: string;
  referralLevel: 'bronze' | 'prata' | 'ouro' | 'platina';
  totalReferrals: number;
  activeReferrals: number;
  commissionBalance: number;
  isLoading: boolean;
  error: string | null;
}
