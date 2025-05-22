import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Referral {
  id: string;
  referredUserId: string;
  referredUserName: string;
  referredUserEmail: string;
  status: 'pending' | 'completed';
  commission: number;
  createdAt: string;
}

interface ReferralStats {
  totalReferrals: number;
  totalCommissions: number;
  pendingCommissions: number;
  availableCommissions: number;
}

interface ReferralState {
  referrals: Referral[];
  stats: ReferralStats;
  loading: boolean;
  error: string | null;
}

const initialState: ReferralState = {
  referrals: [],
  stats: {
    totalReferrals: 0,
    totalCommissions: 0,
    pendingCommissions: 0,
    availableCommissions: 0,
  },
  loading: false,
  error: null,
};

const referralSlice = createSlice({
  name: 'referrals',
  initialState,
  reducers: {
    setReferrals: (state, action: PayloadAction<Referral[]>) => {
      state.referrals = action.payload;
    },
    addReferral: (state, action: PayloadAction<Referral>) => {
      state.referrals.unshift(action.payload);
    },
    updateReferralStatus: (
      state,
      action: PayloadAction<{ referralId: string; status: Referral['status'] }>
    ) => {
      const referral = state.referrals.find(
        (ref) => ref.id === action.payload.referralId
      );
      if (referral) {
        referral.status = action.payload.status;
      }
    },
    setStats: (state, action: PayloadAction<ReferralStats>) => {
      state.stats = action.payload;
    },
    updateStats: (state, action: PayloadAction<Partial<ReferralStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setReferrals,
  addReferral,
  updateReferralStatus,
  setStats,
  updateStats,
  setLoading,
  setError,
} = referralSlice.actions;
export default referralSlice.reducer;
