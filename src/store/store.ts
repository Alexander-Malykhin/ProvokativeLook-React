import { configureStore } from "@reduxjs/toolkit";
import toggleMenuProfileReducer from "@store/slices/toggleMenuProfileSlice.ts";
import toggleMenuNavigationReducer from "@store/slices/toggleMenuNavigationSlice.ts";
import toggleSearchReducer from "@store/slices/toggleSearchSlice.ts";
//api
import { aboutApi } from "@store/api/about/aboutApi.ts";
import { contactsApi } from "@store/api/contacts/contactsApi.ts";
import { settingsApi } from "@store/api/settings/settingsApi.ts";
import { navigationApi } from "@store/api/navigation/navigationApi.ts";

export const store = configureStore({
    reducer: {
        toggleMenuProfile: toggleMenuProfileReducer,
        toggleMenuNavigation: toggleMenuNavigationReducer,
        toggleSearch: toggleSearchReducer,

        [aboutApi.reducerPath]: aboutApi.reducer,
        [contactsApi.reducerPath]: contactsApi.reducer,
        [settingsApi.reducerPath]: settingsApi.reducer,
        [navigationApi.reducerPath]: navigationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            aboutApi.middleware,
            contactsApi.middleware,
            settingsApi.middleware,
            navigationApi.middleware
        ),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;