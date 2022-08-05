import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
import {Provider} from 'react-redux';
import {store, persistor} from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClientProvider, QueryClient } from 'react-query';
const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
      <App />
      </QueryClientProvider>
      </PersistGate>
      </Provider>
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
