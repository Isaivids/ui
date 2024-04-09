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

export const getCategory = createAsyncThunk('getCategory', async () => {
    const response = await apiCall.get(`/getCategory`);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const addCategory = createAsyncThunk('addCategory', async (body:any) => {
    const response = await apiCall.post(`/addCategory`,body);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const updateCategory = createAsyncThunk('updateCategory', async (body:any) => {
    const response = await apiCall.post(`/updateCategory`,body);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const deleteCategory = createAsyncThunk('deleteCategory', async (body:any) => {
    const response = await apiCall.post(`/deleteCategory`,body);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})


const CategorySlice = createSlice({
    initialState,
    name: 'getCategory',
    reducers: {
        clearCategory: (state) => {
            return { ...state, body: {} }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getCategory.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(getCategory.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(getCategory.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(addCategory.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(addCategory.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(addCategory.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(updateCategory.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(updateCategory.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(updateCategory.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(deleteCategory.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(deleteCategory.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(deleteCategory.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
    }
})
export const { clearCategory } = CategorySlice.actions;
export default CategorySlice.reducer;