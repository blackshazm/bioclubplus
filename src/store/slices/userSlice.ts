import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card';
  lastFourDigits: string;
  brand: string;
  holderName: string;
  expirationDate: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  preferences: {
    notifications: boolean;
    newsletter: boolean;
  };
}

interface UserState {
  profile: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      if (state.profile) {
        state.profile.addresses.push(action.payload);
      }
    },
    removeAddress: (state, action: PayloadAction<number>) => {
      if (state.profile) {
        state.profile.addresses.splice(action.payload, 1);
      }
    },
    addPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      if (state.profile) {
        state.profile.paymentMethods.push(action.payload);
      }
    },
    removePaymentMethod: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.paymentMethods = state.profile.paymentMethods.filter(
          (method) => method.id !== action.payload
        );
      }
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
  setProfile,
  updateProfile,
  addAddress,
  removeAddress,
  addPaymentMethod,
  removePaymentMethod,
  setLoading,
  setError,
} = userSlice.actions;
export default userSlice.reducer;
