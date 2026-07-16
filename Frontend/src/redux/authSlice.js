import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { loginAPI, registerAPI } from "./authAPI";

const initialState = {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (data, thunkAPI) => {
        try{
            return await loginAPI(data);
        }catch(error){
            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (data, thunkAPI) => {
        try{
            return await registerAPI(data);
        }catch(error){
            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);

const authSlice = createSlice({
    name:"auth",
    initialState,

    reducers:{
        logout:(state)=>{
            state.user = null;
            state.token = null;

            localStorage.removeItem("token");
            localStorage.removeItem("role");
        },
    },

    extraReducers:(builder)=>{

        builder

        .addCase(loginUser.pending,(state)=>{
            state.loading = true;
        })

        .addCase(loginUser.fulfilled,(state,action)=>{
            state.loading = false;

            state.user = action.payload.data;

            state.token = action.payload.token;

            localStorage.setItem(
                "token",
                action.payload.token
            );

            localStorage.setItem(
                "role",
                action.payload.data.role
            );
        })

        .addCase(loginUser.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(registerUser.pending,(state)=>{
            state.loading = true;
        })

        .addCase(registerUser.fulfilled,(state)=>{
            state.loading = false;
        })

        .addCase(registerUser.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;