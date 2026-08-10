import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// slices
import toggleMenuProfileReducer from "@store/slices/toggleMenuProfileSlice.ts";
import toggleMenuNavigationReducer from "@store/slices/toggleMenuNavigationSlice.ts";
import toggleSearchReducer from "@store/slices/toggleSearchSlice.ts";
import toggleModalTableSizesReducer from "@store/slices/toggleModalTableSizesSlice.ts";
import toggleAuthModalReducer from "@store/slices/toggleAuthModalSlice.ts";
import toggleFilterSliceReducer from "@store/slices/toggleFIlterSlice.ts";

import { baseApi } from "@store/api/baseApi";

export const store = configureStore({
  reducer: {
    toggleMenuProfile: toggleMenuProfileReducer,
    toggleMenuNavigation: toggleMenuNavigationReducer,
    toggleSearch: toggleSearchReducer,
    toggleModalTableSizes: toggleModalTableSizesReducer,
    toggleAuthModal: toggleAuthModalReducer,
    toggleFilter: toggleFilterSliceReducer,

    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
