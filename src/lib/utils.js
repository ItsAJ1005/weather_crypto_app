import { format, fromUnixTime } from 'date-fns';

// Currency formatting
export const formatCurrency = (value, currency = 'USD', maximumFractionDigits = 2) => {
  if (value === null || value === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits,
  }).format(value);
};

// Percentage formatting
export const formatPercentage = (value, maximumFractionDigits = 2) => {
  if (value === null || value === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits,
    signDisplay: 'always',
  }).format(value / 100);
};

// Number formatting with thousands separators
export const formatNumber = (value, maximumFractionDigits = 2) => {
  if (value === null || value === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
  }).format(value);
};

// Convert Unix timestamp to formatted date
export const formatDate = (timestamp, formatString = 'MMM d, yyyy') => {
  if (!timestamp) return 'N/A';
  
  return format(
    typeof timestamp === 'number' ? fromUnixTime(timestamp) : new Date(timestamp),
    formatString
  );
};

// Format temperature with units
export const formatTemperature = (temp, unit = 'C') => {
  if (temp === null || temp === undefined) return 'N/A';
  
  return `${Math.round(temp)}°${unit}`;
};

// Weather icon URL helper
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Get crypto icon URL
export const getCryptoIconUrl = (id) => {
  return `https://assets.coingecko.com/coins/images/${id}/small/icon.png`;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Generate random color based on string
export const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};

// Format data for Chart.js
export const formatChartData = (data, label) => {
  if (!data || !data.prices) return null;
  
  return {
    labels: data.prices.map(item => formatDate(item[0], 'MMM d')),
    datasets: [
      {
        label,
        data: data.prices.map(item => item[1]),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
};

// Weather related helpers
export const getWeatherDescription = (weather) => {
  if (!weather || !weather.weather || !weather.weather[0]) return 'Unknown';
  return weather.weather[0].description.charAt(0).toUpperCase() + 
         weather.weather[0].description.slice(1);
};

// Get theme class based on weather
export const getWeatherThemeClass = (weatherMain) => {
  if (!weatherMain) return 'weather-default';
  
  const weatherType = weatherMain.toLowerCase();
  
  if (weatherType.includes('clear')) return 'weather-sunny';
  if (weatherType.includes('cloud')) return 'weather-cloudy';
  if (weatherType.includes('rain') || weatherType.includes('drizzle')) return 'weather-rainy';
  if (weatherType.includes('thunder') || weatherType.includes('storm')) return 'weather-stormy';
  if (weatherType.includes('snow')) return 'weather-snowy';
  if (weatherType.includes('mist') || weatherType.includes('fog')) return 'weather-foggy';
  
  return 'weather-default';
};

// Check if an item is in favorites
export const isInFavorites = (id, favorites) => {
  return favorites.includes(id);
};

// Format news date
export const formatNewsDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return format(new Date(dateStr), 'MMM d, yyyy');
};

// Get city name for URL
export const getCitySlug = (city) => {
  return city.toLowerCase().replace(/\s+/g, '-');
};

// Get city from slug
export const getCityFromSlug = (slug) => {
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export default {
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatDate,
  formatTemperature,
  getWeatherIconUrl,
  getCryptoIconUrl,
  truncateText,
  stringToColor,
  formatChartData,
  getWeatherDescription,
  getWeatherThemeClass,
  isInFavorites,
  formatNewsDate,
  getCitySlug,
  getCityFromSlug,
};