import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slices/cartSlice";
const store = configureStore({
  reducer: { cart: cartReducer },
});
store.subscribe(() => {
  try {
    const state = store.getState();
    const serializedCart = JSON.stringify(state.cart);
    localStorage.setItem("cart", serializedCart);
  } catch (e) {
    console.warn("Failed to save cart to localStorage:", e);
  }
});
export default store;
