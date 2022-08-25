import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userRedux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import OrdersSlice from '../Reducers/OrdersSlice';
import NotificationsSlice from '../Reducers/NotificationSlice';

const persistConfig = {
  key: 'BMM',
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  ordersState: OrdersSlice,
  notificationsState: NotificationsSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
