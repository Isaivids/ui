import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCall } from '../../api/api';
export interface State {
    body: any,
    loading: boolean,
    error: boolean,
    loadedBills :any
}

const initialState = {
    body : [],
    loading : false,
    error : false,
    loadedBills : {}
}

export const addBill = createAsyncThunk('addBill', async (body: any) => {
    const response = await apiCall.post(`/addBill`, body);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const getBills = createAsyncThunk('getBills', async (body: any) => {
    const response = await apiCall.post(`/getBills`, body);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

const billSlice = createSlice({
    initialState,
    name: 'addBill',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addBill.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(addBill.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(addBill.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(getBills.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(getBills.fulfilled, (state, { payload }) => {
            return { ...state, loadedBills: payload, error: false, loading: false }
        })
        builder.addCase(getBills.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
    }
})
export default billSlice.reducer;