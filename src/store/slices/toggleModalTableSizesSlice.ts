import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
    isModalTableSizesOpen: boolean;
}

const initialState: ModalState = {
    isModalTableSizesOpen: false,
};

const toggleModalTableSizesSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        toggleModalTableSizes: (state) => {
            state.isModalTableSizesOpen = !state.isModalTableSizesOpen;
        },
    },
});

export const { toggleModalTableSizes } = toggleModalTableSizesSlice.actions;
export default toggleModalTableSizesSlice.reducer;