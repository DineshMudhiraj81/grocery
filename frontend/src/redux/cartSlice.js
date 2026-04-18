import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 🔥 Store full cart from backend
    setCart: (state, action) => {
      state.cartItems = action.payload;

      // ✅ Save to localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // 🔥 Clear cart (frontend reset)
    clearCart: (state) => {
      state.cartItems = [];

       // ✅ Clear from localStorage
      localStorage.removeItem("cartItems");
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;