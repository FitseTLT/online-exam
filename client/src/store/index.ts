import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice/userReducer";

export default configureStore({
    reducer: { user: userReducer },
});
