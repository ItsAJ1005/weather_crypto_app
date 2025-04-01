import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import { fetchWeatherForecast } from '../../store/slices/weatherSlice';
import Layout from '../../components/Layout';
import WeatherChart from '../../components/weather/WeatherChart';
import WeatherTable from '../../components/weather/WeatherTable';
import { toggleCityFavorite } from '../../store/slices/favoritesSlice';
import { FaStar, FaRegStar, FaArrowLeft } from 'react-icons/fa';
import { format } from 'date-fns';

const CityDetailPage = () => {
  const router = useRouter();
  const { city } = router.query;
  const dispatch = useDispatch();
  
  const { forecasts, forecastLoading, error } = useSelector((state) => state.weather);
  const { cities: favoriteCities } = useSelector((state) => state.favorites);
  
  const cityData = useSelector((state) => 
    state.weather.cities.find(c => c.name.toLowerCase() === city?.toLowerCase())
  );
  
  const forecast = forecasts[city];
  const isFavorite = favoriteCities.includes(city);
  
  useEffect(() => {
    if (city && !forecast && !forecastLoading) {
      dispatch(fetchWeatherForecast(city));
    }
  }, [city, forecast, forecastLoading, dispatch]);
  
  const handleToggleFavorite = () => {
    dispatch(toggleCityFavorite(city));
  };
  
  if (!city) {
    return <div>Loading...</div>;
  }
  
  return (
    <Layout>
      <Head>
        <title>{city} Weather | CryptoWeather Nexus</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/weather" className="mr-4 text-primary-600 hover:text-primary-800">
              <FaArrowLeft />
            </Link>
            <h1 className="text-3xl font-bold">{city} Weather</h1>
          </div>
          
          <button
            onClick={handleToggleFavorite}
            className="text-yellow-500 text-2xl focus:outline-none"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? <FaStar /> : <FaRegStar />}
          </button>
        </div>
        
        {cityData && (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                {cityData.weather && cityData.weather[0] && (
                  <img 
                    src={`https://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png`}
                    alt={cityData.weather[0].description}
                    className="w-24 h-24"
                  />
                )}
                <div>
                  <p className="text-4xl font-bold">{Math.round(cityData.main.temp)}°C</p>
                  <p className="text-lg capitalize">
                    {cityData.weather && cityData.weather[0] ? cityData.weather[0].description : 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Updated: {format(new Date(cityData.dt * 1000), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
                  <p className="text-lg font-medium">{cityData.main.humidity}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Wind</p>
                  <p className="text-lg font-medium">{Math.round(cityData.wind.speed * 3.6)} km/h</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Feels like</p>
                  <p className="text-lg font-medium">{Math.round(cityData.main.feels_like)}°C</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pressure</p>
                  <p className="text-lg font-medium">{cityData.main.pressure} hPa</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5-Day Forecast</h2>
          {forecastLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-200">
              Error loading forecast: {error}
            </div>
          ) : forecast ? (
            <>
              <WeatherChart forecast={forecast} />
              <div className="mt-8">
                <WeatherTable forecast={forecast} />
              </div>
            </>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              No forecast data available.
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">City Information</h2>
          {cityData && (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Coordinates</p>
                  <p className="text-lg font-medium">
                    Lat: {cityData.coord.lat}, Lon: {cityData.coord.lon}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sunrise / Sunset</p>
                  <p className="text-lg font-medium">
                    {format(new Date(cityData.sys.sunrise * 1000), 'h:mm a')} / {format(new Date(cityData.sys.sunset * 1000), 'h:mm a')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Temperature Range</p>
                  <p className="text-lg font-medium">
                    Min: {Math.round(cityData.main.temp_min)}°C, Max: {Math.round(cityData.main.temp_max)}°C
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Visibility</p>
                  <p className="text-lg font-medium">
                    {(cityData.visibility / 1000).toFixed(1)} km
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CityDetailPage;