// /redux/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // { id, title, price, quantity, stock, sku, images, size, color }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      const { id, size, color, quantity = 1, ...rest } = action.payload;

      // Match by id + size + color to differentiate variations
      const existingItem = state.items.find(
        (item) => item.id === id && item.size === size && item.color === color
      );

      if (existingItem) {
        // Increase quantity but don't exceed stock
        if (existingItem.quantity + quantity <= existingItem.stock) {
          existingItem.quantity += quantity;
        } else {
          existingItem.quantity = existingItem.stock; // cap at stock
        }
      } else {
        state.items.push({ id, size, color, quantity, ...rest });
      }
    },

    removeItem(state, action) {
      const { id, size, color } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(item.id === id && item.size === size && item.color === color)
      );
    },

    increaseQuantity(state, action) {
      const { id, size, color } = action.payload;
      const item = state.items.find(
        (item) => item.id === id && item.size === size && item.color === color
      );
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
      }
    },

    decreaseQuantity(state, action) {
      const { id, size, color } = action.payload;
      const item = state.items.find(
        (item) => item.id === id && item.size === size && item.color === color
      );
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
