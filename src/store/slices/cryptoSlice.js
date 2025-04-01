import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define crypto assets to track
const cryptoIds = ['bitcoin', 'ethereum', 'ripple'];

// Async thunk for fetching crypto data
export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoIds.join(',')}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching details of a specific crypto
export const fetchCryptoDetails = createAsyncThunk(
  'crypto/fetchCryptoDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching historical data
export const fetchCryptoHistory = createAsyncThunk(
  'crypto/fetchCryptoHistory',
  async ({ id, days = 7 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
      );
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  cryptos: [],
  selectedCrypto: null,
  history: {},
  priceAlerts: [],
  loading: false,
  detailsLoading: false,
  historyLoading: false,
  error: null,
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updateCryptoPrice: (state, action) => {
      const { id, price, priceChange24h } = action.payload;
      const index = state.cryptos.findIndex(crypto => crypto.id === id);
      
      if (index !== -1) {
        state.cryptos[index].current_price = price;
        state.cryptos[index].price_change_24h = priceChange24h;
      }
    },
    addPriceAlert: (state, action) => {
      state.priceAlerts.push(action.payload);
    },
    clearPriceAlerts: (state) => {
      state.priceAlerts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false;
        state.cryptos = action.payload;
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCryptoDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchCryptoDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedCrypto = action.payload;
      })
      .addCase(fetchCryptoDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCryptoHistory.pending, (state) => {
        state.historyLoading = true;
        state.error = null;
      })
      .addCase(fetchCryptoHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.history[action.payload.id] = action.payload.data;
      })
      .addCase(fetchCryptoHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.error = action.payload;
      });
  },
});

export const { updateCryptoPrice, addPriceAlert, clearPriceAlerts } = cryptoSlice.actions;

export default cryptoSlice.reducer;