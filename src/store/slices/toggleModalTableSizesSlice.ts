import { createSlice } from "@reduxjs/toolkit";
interface ModalState {
    isModalTableSizesOpen: boolean;
    rows: string[][];
}
const initialState: ModalState = {
    isModalTableSizesOpen: false,
    rows: [],
};
const toggleModalTableSizesSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        openTableSizes: (state, action: { payload: { rows: string[][] } }) => {
            state.isModalTableSizesOpen = true;
            state.rows = action.payload.rows;
        },
        closeTableSizes: (state) => {
            state.isModalTableSizesOpen = false;
            state.rows = [];
        },
        toggleModalTableSizes: (state) => {
            state.isModalTableSizesOpen = !state.isModalTableSizesOpen;
        },
    },
});
export const { openTableSizes, closeTableSizes, toggleModalTableSizes } = toggleModalTableSizesSlice.actions;
export default toggleModalTableSizesSlice.reducer;
