import { configureStore } from "@reduxjs/toolkit";
import groceryReducer from "../redux/grocerySlice";
import cartReducer from "../redux/cartSlice";

export const store = configureStore({
  reducer: {
    grocery: groceryReducer,
    cart: cartReducer,
  },
});