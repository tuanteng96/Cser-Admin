import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../App/modules/Auth/_redux/authSlice";

export default configureStore({
    reducer: {
        Auth: authReducer,
    },
})