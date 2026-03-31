import { createSlice } from "@reduxjs/toolkit";

const grocerySlice = createSlice({
  name: "grocery",
  initialState: {
    items: [],
  },
  reducers: {
    addGrocery: (state, action) => {
      state.items.push(action.payload);
    },
  },
});

export const { addGrocery } = grocerySlice.actions;
export default grocerySlice.reducer;