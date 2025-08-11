// /redux/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // { id, title, price, quantity, stock, sku, images }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        // Increase quantity but don't exceed stock
        if (existingItem.quantity < existingItem.stock) {
          existingItem.quantity += 1;
        }
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }
    },

    removeItem(state, action) {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
    },

    increaseQuantity(state, action) {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
      }
    },

    decreaseQuantity(state, action) {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    clearCart(state) {
      state.items = [];
    },
    setCart(state, action) {
      state.items = action.payload.items || [];
    },
  },
});

// Selectors
export const selectCartItems = (state) => state.cart.items;

export const selectTotalQuantity = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectTotalPrice = (state) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

export const {
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  setCart,
} = cartSlice.actions;

export default cartSlice.reducer;
