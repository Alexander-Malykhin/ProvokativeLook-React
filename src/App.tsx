import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
//router
import { router } from "@routes/router.tsx";
//store
import { store } from "@store/store.ts";
import RealtimeBridge from "@components/system/RealtimeBridge/RealtimeBridge";

const App = () => (
  <Provider store={store}>
    <RealtimeBridge />
    <RouterProvider router={router} />
  </Provider>
);

export default App;
