import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching news data
export const fetchNewsData = createAsyncThunk(
  'news/fetchNewsData',
  async (_, { rejectWithValue }) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
      const response = await axios.get(
        `https://newsdata.io/api/1/news?apikey=${apiKey}&q=cryptocurrency OR bitcoin OR ethereum&language=en&size=5`
      );
      return response.data.results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  articles: [],
  loading: false,
  error: null,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsData.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default newsSlice.reducer;