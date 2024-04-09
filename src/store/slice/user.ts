import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { apiCall } from '../../api/api';

export interface State {
    body: any,
    loading: boolean,
    error: boolean,
    selectedUser : any
}

const initialState: State = {
    body: {},
    loading: false,
    error: false,
    selectedUser : {}
}
export const getUsers = createAsyncThunk('getUsers', async () => {
    const response = await apiCall.get(`/getUsers`);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const changeActive = createAsyncThunk('changeActive', async (body:any) => {
    const response = await apiCall.put(`/changeActive`,body);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const addUser = createAsyncThunk('addUser', async (body:any) => {
    const response = await apiCall.post(`/addUser`,body);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const deleteUser = createAsyncThunk('deleteUser', async (body:any) => {
    const response = await apiCall.post(`/deleteUser`,body);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

const UserSlice = createSlice({
    initialState,
    name: 'user',
    reducers: {
        clearUser: (state) => {
            return { ...state, body: {data : []},selectedUser: {} }
        },
        // addUser: (state, action: PayloadAction<string>) => {
        //     const user: any = action.payload;
        //     state.body.data = user
        // },
        setLoggedInUser: (state, action: PayloadAction<string>) => {
            const user: any = action.payload;
            state.selectedUser = user
        },
        clearSelectedUser: (state) => {
            const today = new Date();
            const timestamp = today.getTime();
            state.selectedUser = {
                _id : 'id' + timestamp,
                name: 'C'+timestamp,
                admin: false,
                active: true,
              };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getUsers.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(getUsers.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(getUsers.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(changeActive.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(changeActive.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(changeActive.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(addUser.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(addUser.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(addUser.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(deleteUser.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(deleteUser.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(deleteUser.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
    }
})
export const { clearUser,setLoggedInUser,clearSelectedUser } = UserSlice.actions;
export default UserSlice.reducer;