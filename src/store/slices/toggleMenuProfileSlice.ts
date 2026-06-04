import {createSlice} from "@reduxjs/toolkit";

interface ToggleMenuProfileState {
    active: boolean;
}

const initialState: ToggleMenuProfileState = {
    active: false,
};

export const toggleMenuProfileSlice = createSlice({
    name: "toggleMenuProfile",
    initialState,
    reducers: {
        toggle: (state) => {
            state.active = !state.active;
        },
        close: (state) => {
            state.active = false;
        },
    },
});

export const {toggle, close} = toggleMenuProfileSlice.actions;

export default toggleMenuProfileSlice.reducer;