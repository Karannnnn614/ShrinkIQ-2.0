import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import linksReducer from './slices/linksSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    links: linksReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;