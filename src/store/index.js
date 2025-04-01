import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from './slices/cryptoSlice';
import weatherReducer from './slices/weatherSlice';
import newsReducer from './slices/newsSlice';
import favoritesReducer from './slices/favoritesSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    weather: weatherReducer,
    news: newsReducer,
    favorites: favoritesReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;