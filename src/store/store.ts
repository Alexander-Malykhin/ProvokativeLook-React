import { configureStore } from "@reduxjs/toolkit";
import toggleMenuProfileReducer from "@store/slices/toggleMenuProfileSlice.ts";
import toggleMenuNavigationReducer from "@store/slices/toggleMenuNavigationSlice.ts";
import toggleSearchReducer from "@store/slices/toggleSearchSlice.ts";

export const store = configureStore({
    reducer: {
        toggleMenuProfile: toggleMenuProfileReducer,
        toggleMenuNavigation:toggleMenuNavigationReducer,
        toggleSearch:toggleSearchReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;