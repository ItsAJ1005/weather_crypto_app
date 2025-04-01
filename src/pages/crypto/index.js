import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import { fetchCryptoData } from '../../store/slices/cryptoSlice';
import CryptoTable from '../../components/crypto/CryptoTable';
import CryptoChart from '../../components/crypto/CryptoChart';
import Spinner from '../../components/ui/Spinner';

export default function CryptoOverview() {
  const dispatch = useDispatch();
  const { cryptos, loading, error } = useSelector(state => state.crypto);
  const { cryptos: favoriteCryptos } = useSelector(state => state.favorites);
  
  useEffect(() => {
    dispatch(fetchCryptoData());
  }, [dispatch]);
  
  // Format data for the market cap comparison chart
  const chartData = {
    labels: cryptos.map(crypto => crypto.name),
    datasets: [
      {
        label: 'Market Cap (USD)',
        data: cryptos.map(crypto => crypto.market_cap),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  return (
    <>
      <Head>
        <title>Cryptocurrency Market Overview - CryptoWeather Nexus</title>
        <meta name="description" content="Comprehensive view of cryptocurrency market data" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Cryptocurrency Overview</h1>
        
        {loading && <div className="flex justify-center py-10"><Spinner /></div>}
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            Error loading cryptocurrency data: {error}
          </div>
        )}
        
        {!loading && !error && (
          <>
            {/* Market Overview Charts */}
            <section className="mb-10">
              <h2 className="section-title">Market Overview</h2>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 h-80">
                <CryptoChart data={chartData} type="pie" />
              </div>
            </section>
            
            {/* Favorites Section (if any) */}
            {favoriteCryptos.length > 0 && (
              <section className="mb-10">
                <h2 className="section-title">Your Favorites</h2>
                <div className="overflow-x-auto">
                  <CryptoTable 
                    cryptos={cryptos.filter(crypto => favoriteCryptos.includes(crypto.id))} 
                    favorites={favoriteCryptos} 
                  />
                </div>
              </section>
            )}
            
            {/* All Cryptocurrencies */}
            <section>
              <h2 className="section-title">All Cryptocurrencies</h2>
              <div className="overflow-x-auto">
                <CryptoTable cryptos={cryptos} favorites={favoriteCryptos} />
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}