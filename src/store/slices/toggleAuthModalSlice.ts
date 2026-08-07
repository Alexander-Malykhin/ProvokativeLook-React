import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthModalMode = "login" | "register" | "confirm";

interface ToggleAuthModalState {
  active: boolean;
  mode: AuthModalMode;
}

const initialState: ToggleAuthModalState = {
  active: false,
  mode: "login",
};

export const toggleAuthModalSlice = createSlice({
  name: "toggleAuthModal",

  initialState,

  reducers: {
    openAuthModal: (
      state,
      action: PayloadAction<AuthModalMode | undefined>,
    ) => {
      state.active = true;
      state.mode = action.payload ?? "login";
    },

    closeAuthModal: (state) => {
      state.active = false;
      state.mode = "login";
    },

    setAuthModalMode: (state, action: PayloadAction<AuthModalMode>) => {
      state.mode = action.payload;
    },
  },
});

export const { openAuthModal, closeAuthModal, setAuthModalMode } =
  toggleAuthModalSlice.actions;

export default toggleAuthModalSlice.reducer;
