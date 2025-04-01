import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import { fetchCryptoData } from '../store/slices/cryptoSlice';
import { fetchWeatherData } from '../store/slices/weatherSlice';
import { fetchNewsData } from '../store/slices/newsSlice';
import CryptoCard from '../components/crypto/CryptoCard';
import WeatherCard from '../components/weather/WeatherCard';
import NewsWidget from '../components/news/NewsWidget';
import Spinner from '../components/ui/Spinner';

export default function Home() {
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const { cryptos, loading: cryptoLoading, error: cryptoError } = useSelector(state => state.crypto);
  const { cities, loading: weatherLoading, error: weatherError } = useSelector(state => state.weather);
  const { articles, loading: newsLoading, error: newsError } = useSelector(state => state.news);
  const { cryptos: favoriteCryptos, cities: favoriteCities } = useSelector(state => state.favorites);
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchCryptoData());
    dispatch(fetchWeatherData());
    dispatch(fetchNewsData());
  }, [dispatch]);
  
  return (
    <>
      <Head>
        <title>CryptoWeather Nexus - Dashboard</title>
        <meta name="description" content="Real-time cryptocurrency, weather, and news dashboard" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">CryptoWeather Nexus</h1>
        
        {/* Favorites Section (if any) */}
        {(favoriteCryptos.length > 0 || favoriteCities.length > 0) && (
          <section className="mb-10">
            <h2 className="section-title">Your Favorites</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Favorite Cryptos */}
              {favoriteCryptos.length > 0 && cryptos.filter(crypto => favoriteCryptos.includes(crypto.id)).map(crypto => (
                <CryptoCard key={`fav-${crypto.id}`} crypto={crypto} favorite={true} />
              ))}
              
              {/* Favorite Cities */}
              {favoriteCities.length > 0 && cities.filter(city => favoriteCities.includes(city.name)).map(city => (
                <WeatherCard key={`fav-${city.name}`} weather={city} favorite={true} />
              ))}
            </div>
          </section>
        )}
        
        {/* Cryptocurrency Section */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">Cryptocurrency</h2>
            <Link href="/crypto" className="text-primary-600 hover:text-primary-800 font-medium">
              View All →
            </Link>
          </div>
          
          {cryptoLoading && <div className="flex justify-center py-10"><Spinner /></div>}
          
          {cryptoError && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
              Error loading cryptocurrency data: {cryptoError}
            </div>
          )}
          
          {!cryptoLoading && !cryptoError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cryptos.map(crypto => (
                <CryptoCard 
                  key={crypto.id} 
                  crypto={crypto} 
                  favorite={favoriteCryptos.includes(crypto.id)} 
                />
              ))}
            </div>
          )}
        </section>
        
        {/* Weather Section */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">Weather</h2>
            <Link href="/weather" className="text-primary-600 hover:text-primary-800 font-medium">
              View All →
            </Link>
          </div>
          
          {weatherLoading && <div className="flex justify-center py-10"><Spinner /></div>}
          
          {weatherError && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
              Error loading weather data: {weatherError}
            </div>
          )}
          
          {!weatherLoading && !weatherError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map(city => (
                <WeatherCard 
                  key={city.name} 
                  weather={city} 
                  favorite={favoriteCities.includes(city.name)} 
                />
              ))}
            </div>
          )}
        </section>
        
        {/* News Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">Latest News</h2>
            <Link href="/news" className="text-primary-600 hover:text-primary-800 font-medium">
              View All →
            </Link>
          </div>
          
          {newsLoading && <div className="flex justify-center py-10"><Spinner /></div>}
          
          {newsError && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
              Error loading news data: {newsError}
            </div>
          )}
          
          {!newsLoading && !newsError && (
            <NewsWidget articles={articles.slice(0, 5)} />
          )}
        </section>
      </main>
    </>
  );
}