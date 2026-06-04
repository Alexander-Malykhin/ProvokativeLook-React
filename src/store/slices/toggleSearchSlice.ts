import {createSlice} from "@reduxjs/toolkit";

interface toggleSearchState {
    active: boolean;
}

const initialState: toggleSearchState = {
    active: false,
};

export const toggleSearchSlice = createSlice({
    name: "toggleSearch",
    initialState,
    reducers: {
        add: (state) => {
            state.active = true;
        },
        close: (state) => {
            state.active = false;
        },
    },
});

export const {add, close} = toggleSearchSlice.actions;

export default toggleSearchSlice.reducer;