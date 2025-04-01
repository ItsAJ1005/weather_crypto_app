import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import { fetchWeatherData } from '../../store/slices/weatherSlice';
import WeatherCard from '../../components/weather/WeatherCard';
import Spinner from '../../components/ui/Spinner';

export default function WeatherOverview() {
  const dispatch = useDispatch();
  const { cities, loading, error } = useSelector(state => state.weather);
  const { cities: favoriteCities } = useSelector(state => state.favorites);
  
  useEffect(() => {
    dispatch(fetchWeatherData());
  }, [dispatch]);
  
  return (
    <>
      <Head>
        <title>Weather Overview - CryptoWeather Nexus</title>
        <meta name="description" content="Global weather conditions and forecasts" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Weather Overview</h1>
        
        {loading && <div className="flex justify-center py-10"><Spinner /></div>}
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            Error loading weather data: {error}
          </div>
        )}
        
        {!loading && !error && (
          <>
            {/* Favorites Section (if any) */}
            {favoriteCities.length > 0 && (
              <section className="mb-10">
                <h2 className="section-title">Your Favorite Locations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cities
                    .filter(city => favoriteCities.includes(city.name))
                    .map(city => (
                      <Link href={`/weather/${encodeURIComponent(city.name)}`} key={`fav-${city.id}`}>
                        <WeatherCard 
                          weather={city} 
                          favorite={true} 
                          className="h-full cursor-pointer transform hover:scale-105 transition-transform"
                        />
                      </Link>
                    ))
                  }
                </div>
              </section>
            )}
            
            {/* All Cities */}
            <section>
              <h2 className="section-title">All Locations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cities.map(city => (
                  <Link href={`/weather/${encodeURIComponent(city.name)}`} key={city.id}>
                    <WeatherCard 
                      weather={city} 
                      favorite={favoriteCities.includes(city.name)} 
                      className="h-full cursor-pointer transform hover:scale-105 transition-transform"
                    />
                  </Link>
                ))}
              </div>
            </section>
            
            {/* Weather Map Section */}
            <section className="mt-10">
              <h2 className="section-title">Global Weather Map</h2>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 h-96">
                <iframe 
                  src={`https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=30&lon=0&zoom=2&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}