import axios from 'axios';

// Create API instances for different services
const openWeatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: {
    appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
    units: 'metric',
  },
});

const coinGeckoApi = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
});

const newsDataApi = axios.create({
  baseURL: 'https://newsdata.io/api/1',
  params: {
    apikey: process.env.NEXT_PUBLIC_NEWSDATA_API_KEY,
    language: 'en',
  },
});

// Helper function to handle API errors
const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      error: true,
      status: error.response.status,
      message: error.response.data.message || 'Server error',
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      error: true,
      status: 0,
      message: 'No response from server',
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      error: true,
      status: 0,
      message: error.message,
    };
  }
};

// Weather API methods
export const weatherApi = {
  getCurrentWeather: async (city) => {
    try {
      const response = await openWeatherApi.get('/weather', {
        params: { q: city },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getForecast: async (city) => {
    try {
      const response = await openWeatherApi.get('/forecast', {
        params: { q: city },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Crypto API methods
export const cryptoApi = {
  getMarketData: async (ids = ['bitcoin', 'ethereum', 'ripple'], currency = 'usd') => {
    try {
      const response = await coinGeckoApi.get('/coins/markets', {
        params: {
          vs_currency: currency,
          ids: ids.join(','),
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: true,
          price_change_percentage: '24h',
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getCoinDetails: async (id) => {
    try {
      const response = await coinGeckoApi.get(`/coins/${id}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getHistoricalData: async (id, days = 7, currency = 'usd') => {
    try {
      const response = await coinGeckoApi.get(`/coins/${id}/market_chart`, {
        params: {
          vs_currency: currency,
          days: days,
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// News API methods
export const newsApi = {
  getCryptoNews: async (limit = 5) => {
    try {
      const response = await newsDataApi.get('/news', {
        params: {
          q: 'cryptocurrency OR bitcoin OR ethereum',
          size: limit,
        },
      });
      return response.data.results;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default {
  weather: weatherApi,
  crypto: cryptoApi,
  news: newsApi,
};