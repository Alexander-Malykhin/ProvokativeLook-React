import {createSlice} from "@reduxjs/toolkit";

interface ToggleMenuNavigation {
    active: boolean
}

const initialState: ToggleMenuNavigation = {
    active: false
}

export const toggleMenuNavigationSlice = createSlice({
    name: "toggleMenuNavigation",
    initialState,
    reducers: {
        toggle: (state) => {
            state.active = !state.active;
        },
        close: (state) => {
            state.active = false;
        }
    }
})

export const {toggle, close} = toggleMenuNavigationSlice.actions

export default toggleMenuNavigationSlice.reducer

