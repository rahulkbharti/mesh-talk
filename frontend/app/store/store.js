import { configureStore } from '@reduxjs/toolkit';
import intrestReducer from "../modules/intrest/intrestSlice"
const store = configureStore({
    reducer: {
        intrest: intrestReducer,
    }
});

export default store;