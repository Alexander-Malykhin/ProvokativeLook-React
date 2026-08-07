import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isModalTableSizesOpen: boolean;
}

const initialState: ModalState = {
  isModalTableSizesOpen: false,
};

const toggleModalTableSizesSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openTableSizes: (state) => {
      state.isModalTableSizesOpen = true;
    },
    closeTableSizes: (state) => {
      state.isModalTableSizesOpen = false;
    },
    toggleModalTableSizes: (state) => {
      state.isModalTableSizesOpen = !state.isModalTableSizesOpen;
    },
  },
});

export const { openTableSizes, closeTableSizes, toggleModalTableSizes } =
  toggleModalTableSizesSlice.actions;
export default toggleModalTableSizesSlice.reducer;
