import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartItem, Product, Coupon } from '../../types';

// Initial state
const initialState: Cart = {
  items: [],
  subtotal: 0,
  discount: 0,
  shipping: 0,
  total: 0,
  appliedCoupon: undefined,
};

// Helper function to calculate totals
const calculateTotals = (items: CartItem[], coupon?: Coupon): Partial<Cart> => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  // Calculate discount if coupon is applied
  let discount = 0;
  if (coupon) {
    if (coupon.isPercentage) {
      discount = subtotal * (coupon.discount / 100);
    } else {
      discount = coupon.discount;
    }
  }
  
  // Assume shipping is fixed or calculate based on your business logic
  const shipping = items.length > 0 ? 10 : 0; // Example: $10 shipping fee if cart has items
  
  const total = subtotal - discount + shipping;
  
  return { subtotal, discount, shipping, total };
};

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      
      // Check if product already exists in cart
      const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if product exists
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item if product doesn't exist
        state.items.push({ product, quantity });
      }
      
      // Calculate totals
      const totals = calculateTotals(state.items, state.appliedCoupon);
      state.subtotal = totals.subtotal!;
      state.discount = totals.discount || 0;
      state.shipping = totals.shipping || 0;
      state.total = totals.total!;
    },
    
    removeFromCart: (state, action: PayloadAction<{ productId: string }>) => {
      const { productId } = action.payload;
      
      // Remove item from cart
      state.items = state.items.filter(item => item.product.id !== productId);
      
      // Calculate totals
      const totals = calculateTotals(state.items, state.appliedCoupon);
      state.subtotal = totals.subtotal!;
      state.discount = totals.discount || 0;
      state.shipping = totals.shipping || 0;
      state.total = totals.total!;
    },
    
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      
      // Find and update item quantity
      const itemIndex = state.items.findIndex(item => item.product.id === productId);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items = state.items.filter(item => item.product.id !== productId);
        } else {
          // Update quantity
          state.items[itemIndex].quantity = quantity;
        }
        
        // Calculate totals
        const totals = calculateTotals(state.items, state.appliedCoupon);
        state.subtotal = totals.subtotal!;
        state.discount = totals.discount || 0;
        state.shipping = totals.shipping || 0;
        state.total = totals.total!;
      }
    },
    
    applyCoupon: (state, action: PayloadAction<Coupon>) => {
      const coupon = action.payload;
      
      // Apply coupon
      state.appliedCoupon = coupon;
      
      // Calculate totals with coupon
      const totals = calculateTotals(state.items, coupon);
      state.discount = totals.discount || 0;
      state.total = totals.total!;
    },
    
    removeCoupon: (state) => {
      // Remove coupon
      state.appliedCoupon = undefined;
      
      // Calculate totals without coupon
      const totals = calculateTotals(state.items);
      state.discount = 0;
      state.total = totals.total!;
    },
    
    clearCart: (state) => {
      // Reset cart to initial state
      state.items = [];
      state.subtotal = 0;
      state.discount = 0;
      state.shipping = 0;
      state.total = 0;
      state.appliedCoupon = undefined;
    },
    
    updateShipping: (state, action: PayloadAction<number>) => {
      // Update shipping fee
      state.shipping = action.payload;
      state.total = state.subtotal - (state.discount || 0) + action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
  updateShipping,
} = cartSlice.actions;

export default cartSlice.reducer;
