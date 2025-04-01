import { createSlice } from '@reduxjs/toolkit';

// Initialize state from localStorage if available
const getInitialState = () => {
  if (typeof window !== 'undefined') {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      return JSON.parse(savedFavorites);
    }
  }
  return {
    cryptos: [],
    cities: [],
  };
};

const initialState = getInitialState();

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleCryptoFavorite: (state, action) => {
      const cryptoId = action.payload;
      const index = state.cryptos.indexOf(cryptoId);
      
      if (index === -1) {
        state.cryptos.push(cryptoId);
      } else {
        state.cryptos.splice(index, 1);
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(state));
      }
    },
    toggleCityFavorite: (state, action) => {
      const cityName = action.payload;
      const index = state.cities.indexOf(cityName);
      
      if (index === -1) {
        state.cities.push(cityName);
      } else {
        state.cities.splice(index, 1);
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(state));
      }
    },
    clearAllFavorites: (state) => {
      state.cryptos = [];
      state.cities = [];
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(state));
      }
    },
  },
});

export const { toggleCryptoFavorite, toggleCityFavorite, clearAllFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;