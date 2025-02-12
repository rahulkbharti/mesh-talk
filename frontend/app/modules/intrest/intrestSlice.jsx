import { createSlice } from '@reduxjs/toolkit';

const intrestSlice = createSlice({
    name: 'intrest',
    initialState: {
        intrest: ["Test"],
    },
    reducers: {
        addInterest: (state, action) => {
            state.intrest = [...state.intrest, action.payload];
        },
        removeInterest: (state, action) => {
            state.intrest = state.intrest.filter((intrest) => intrest !== action.payload);
        },
        removeAllInterest: (state) => {
            state.intrest = ["Test"];
        }
    },
});

export const { addInterest, removeInterest, removeAllIntrest } = intrestSlice.actions;
export default intrestSlice.reducer;