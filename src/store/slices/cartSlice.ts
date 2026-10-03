import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "interfaces/products.model";

export interface CartState {
  items: Product[];
  orderPlaced: boolean;
}

const initialState: CartState = {
  items: [],
  orderPlaced: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      if (state.items.find((item) => item._id === action.payload._id))
        state.items = state.items.map((item) => {
          if (item._id === action.payload._id)
            return {
              ...item,
              countInStock:
                Number(item.countInStock) + Number(action.payload.countInStock),
            };
          return item;
        });
      else state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<Product>) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload._id,
      );
    },
    clearItems: (state) => {
      state.items = [];
    },
    changeItemQuantity: (state, action: PayloadAction<Product>) => {
      state.items = state.items.map((item) => {
        if (item._id === action.payload._id)
          return { ...item, countInStock: Number(action.payload.countInStock) };
        return item;
      });
    },
    placeOrderSuccess: (state) => {
      state.orderPlaced = true;
    },
    resetOrderStatus: (state) => {
      state.orderPlaced = false;
    },
  },
});

export const {
  addItem,
  removeItem,
  clearItems,
  changeItemQuantity,
  placeOrderSuccess,
  resetOrderStatus,
} = cartSlice.actions;

export default cartSlice.reducer;
