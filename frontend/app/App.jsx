import AppRouter from "./Router";
import { Provider } from 'react-redux';
import store from "./store/store";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from "./utils/queryClient";
const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
