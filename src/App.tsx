import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { router } from '@routes/router.tsx';
import { store } from '@store/store.ts';
import RealtimeBridge from '@components/system/RealtimeBridge/RealtimeBridge';
const App = () => (
  <Provider store={store}>
    <RealtimeBridge />
    <RouterProvider router={router} />
  </Provider>
);
export default App;
