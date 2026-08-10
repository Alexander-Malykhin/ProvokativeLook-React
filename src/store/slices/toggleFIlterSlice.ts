import {createSlice} from '@reduxjs/toolkit';

interface toggleFilterSlice {
    active: boolean;
}

const initialState: toggleFilterSlice = {
    active: false
};

export const toggleFilterSlice = createSlice({
    name: 'toggleFilter',
    initialState,
    reducers: {
        add:(state) => {
            state.active = true;
        },
        close:(state) => {
            state.active = false;
        }
    }
})

export const {add, close} = toggleFilterSlice.actions;

export default toggleFilterSlice.reducer;