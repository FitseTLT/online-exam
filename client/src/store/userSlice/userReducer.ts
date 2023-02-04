import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "User",
    initialState: {
        signedIn: false,
    },
    reducers: {
        signIn(_, { payload }) {
            return {
                signedIn: true,
                role: payload?.role,
            };
        },
        signOut(_, { payload }) {
            return {
                signedIn: false,
            };
        },
    },
});

const { signIn, signOut } = userSlice.actions;

export default userSlice.reducer;
