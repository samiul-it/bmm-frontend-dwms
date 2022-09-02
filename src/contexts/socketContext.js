import React from 'react';
import io from 'socket.io-client';
import { store } from '../redux/store';

export const socket = io(process.env.REACT_APP_BASE_URL, {
  transports: ['websocket'],
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: `Bearer ${store?.getState()?.user?.currentUser?.token}`,
      },
    },
  },
});

export const SocketContext = React.createContext();
