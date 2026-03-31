import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 🔥 Store full cart from backend
    setCart: (state, action) => {
      state.cartItems = action.payload;
    },

    // 🔥 Clear cart (frontend reset)
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;