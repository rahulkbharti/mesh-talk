import { configureStore } from '@reduxjs/toolkit';
import userReducer from "../modules/intrest/intrestSlice"
const store = configureStore({
    reducer: {
        userData: userReducer,
    }
});

export default store;