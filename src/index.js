import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
import { store, persistor } from './redux/store';

const queryClient = new QueryClient();

ReactDOM.render(
  <ContextProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </ContextProvider>,
  document.getElementById('root')
);
