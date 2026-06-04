import { RouterProvider } from "react-router-dom";
import {Provider} from "react-redux";
//router
import {router} from "@routes/router.tsx";
//store
import {store} from "@store/store.ts";

const App = () => {
    return (
       <Provider store={store}>
           <RouterProvider router={router}/>
       </Provider>
    );
};

export default App;