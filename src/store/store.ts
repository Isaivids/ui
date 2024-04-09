import { configureStore } from "@reduxjs/toolkit";
import CategorySlice from './slice/category';
import ProductSlice from './slice/products';
import cartSlice from './slice/cart';
import UserSlice from './slice/user';
import billSlice from './slice/bill'
export const Store = configureStore({
    reducer: { categoryDetals: CategorySlice, productDetaild: ProductSlice, cartDetails: cartSlice, userDetails: UserSlice, billDetails: billSlice }
})

export type AppDispatch = typeof Store.dispatch