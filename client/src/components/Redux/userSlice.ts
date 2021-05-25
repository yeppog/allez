import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { LoginCredentials } from "../../interface/Credentials";
import axios from "axios";

interface UsersState {
    user: string[];
    status: "idle" | "pending" | "succeeded" | "failed";
    error: string | null | undefined;
}

// interface User {
//     username: string,
//     email: string,
// }

const initialState = {
    user: [],
    status: "idle",
    error: null,
} as UsersState;

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (body: LoginCredentials) => {
        const res = await axios.post(
            "https://https://allez-orbital.herokuapp.com/api/users/login",
            body,
            HTTPOptions
        );
        return res.data;
    }
);

export const checkLoggedInUser = createAsyncThunk(
    "user/checkLoggedInUser",
    async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return { error: "User is not logged in." };
        } else {
            console.log(token);
            const res = await axios.get(
                "https://allez-orbital.herokuapp.com/api/users/verify",
                { headers: { ...HTTPOptions.headers, token: token } }
            );

            return res.data;
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state, action) => {
            state.status = "pending";
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.user = state.user.concat(action.payload);
            localStorage.setItem("token", action.payload.token);
            console.log(localStorage.getItem("token"));
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        });
        builder.addCase(checkLoggedInUser.pending, (state, action) => {
            state.status = "pending";
        });
        builder.addCase(checkLoggedInUser.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.user = state.user.concat(action.payload);
        });
        builder.addCase(checkLoggedInUser.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        });
    },
});

const HTTPOptions = {
    headers: { "Content-Type": "application/json" },
};

export default userSlice.reducer;
export const getUser = (state: UsersState) => state.user;
export const getStatus = (state: UsersState) => state.status;
