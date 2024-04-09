import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCall } from '../../api/api';

export interface State {
    body: any,
    loading: boolean,
    error: boolean,
}

const initialState: State = {
    body: {},
    loading: false,
    error: false,
}

export const getProducts = createAsyncThunk('getProducts', async (body:any) => {
    const response = await apiCall.get(`/getProducts?category=${body.category}&page=${body.page}&rows=${body.rows}&name=${body.name}`);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const createProduct = createAsyncThunk('createProduct', async (body:any) => {
    const response = await apiCall.post(`/createProduct`,body);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const updateProduct = createAsyncThunk('updateProduct', async (body:any) => {
    const response = await apiCall.post(`/updateProduct`,body);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const deleteProduct = createAsyncThunk('deleteProduct', async (body:any) => {
    const response = await apiCall.post(`/deleteProduct`,body);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const addFromExcel = createAsyncThunk('addFromExcel', async (body:any) => {
    const response = await apiCall.post(`/addFromExcel`,body);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})


const ProductSlice = createSlice({
    initialState,
    name: 'getProducts',
    reducers: {
        clearProducts: (state) => {
            return { ...state, body: {} }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getProducts.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(getProducts.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(getProducts.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(deleteProduct.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(deleteProduct.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(deleteProduct.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(createProduct.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(createProduct.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(createProduct.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(addFromExcel.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(addFromExcel.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(addFromExcel.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(updateProduct.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(updateProduct.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(updateProduct.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
    }
})
export const { clearProducts } = ProductSlice.actions;
export default ProductSlice.reducer;