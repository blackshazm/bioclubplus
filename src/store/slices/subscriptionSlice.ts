import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Subscription, SubscriptionState } from '../../types/subscription';
import SubscriptionService from '../../services/SubscriptionService';

const initialState: SubscriptionState = {
  subscription: null,
  subscriptionHistory: [],
  isLoading: false,
  error: null,
};

export const fetchUserSubscription = createAsyncThunk(
  'subscription/fetchUserSubscription',
  async (userId: string, { rejectWithValue }) => {
    try {
      const subscription = await SubscriptionService.getUserSubscription(userId);
      return subscription;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubscriptionHistory = createAsyncThunk(
  'subscription/fetchSubscriptionHistory',
  async (userId: string, { rejectWithValue }) => {
    try {
      const history = await SubscriptionService.getSubscriptionHistory(userId);
      return history;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePaymentMethod = createAsyncThunk(
  'subscription/updatePaymentMethod',
  async ({ userId, paymentDetails }: { userId: string, paymentDetails: any }, { rejectWithValue }) => {
    try {
      const updatedSubscription = await SubscriptionService.updatePaymentMethod(userId, paymentDetails);
      return updatedSubscription;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscription/cancelSubscription',
  async ({ userId, reason }: { userId: string, reason?: string }, { rejectWithValue }) => {
    try {
      const result = await SubscriptionService.cancelSubscription(userId, reason);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Subscription
      .addCase(fetchUserSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserSubscription.fulfilled, (state, action: PayloadAction<Subscription>) => {
        state.isLoading = false;
        state.subscription = action.payload;
      })
      .addCase(fetchUserSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Subscription History
      .addCase(fetchSubscriptionHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionHistory.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.isLoading = false;
        state.subscriptionHistory = action.payload;
      })
      .addCase(fetchSubscriptionHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update Payment Method
      .addCase(updatePaymentMethod.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePaymentMethod.fulfilled, (state, action: PayloadAction<Subscription>) => {
        state.isLoading = false;
        state.subscription = action.payload;
      })
      .addCase(updatePaymentMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Cancel Subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state) => {
        state.isLoading = false;
        if (state.subscription) {
          state.subscription.status = 'canceled';
        }
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSubscriptionError } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
