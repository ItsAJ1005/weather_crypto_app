import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define cities to track
const cities = ['New York', 'London', 'Tokyo'];

// Async thunk for fetching weather data
export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (_, { rejectWithValue }) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      
      const requests = cities.map(city => 
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      );
      
      const responses = await Promise.all(requests);
      return responses.map(response => response.data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching forecast data
export const fetchWeatherForecast = createAsyncThunk(
  'weather/fetchWeatherForecast',
  async (city, { rejectWithValue }) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      return { city, data: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  cities: [],
  forecasts: {},
  weatherAlerts: [],
  loading: false,
  forecastLoading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    addWeatherAlert: (state, action) => {
      state.weatherAlerts.push(action.payload);
    },
    clearWeatherAlerts: (state) => {
      state.weatherAlerts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWeatherForecast.pending, (state) => {
        state.forecastLoading = true;
        state.error = null;
      })
      .addCase(fetchWeatherForecast.fulfilled, (state, action) => {
        state.forecastLoading = false;
        state.forecasts[action.payload.city] = action.payload.data;
      })
      .addCase(fetchWeatherForecast.rejected, (state, action) => {
        state.forecastLoading = false;
        state.error = action.payload;
      });
  },
});

export const { addWeatherAlert, clearWeatherAlerts } = weatherSlice.actions;

export default weatherSlice.reducer;