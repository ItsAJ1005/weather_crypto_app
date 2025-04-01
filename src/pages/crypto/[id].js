import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import { fetchCryptoDetails, fetchCryptoHistory } from '../../store/slices/cryptoSlice';
import { toggleCryptoFavorite } from '../../store/slices/favoritesSlice';
import CryptoChart from '../../components/crypto/CryptoChart';
import Spinner from '../../components/ui/Spinner';
import { FaStar, FaRegStar } from 'react-icons/fa';

export default function CryptoDetail() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  
  const { selectedCrypto, history, detailsLoading, historyLoading, error } = useSelector(state => state.crypto);
  const { cryptos: favoriteCryptos } = useSelector(state => state.favorites);
  
  const isFavorite = id && favoriteCryptos.includes(id);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchCryptoDetails(id));
      dispatch(fetchCryptoHistory({ id, days: 30 }));
    }
  }, [dispatch, id]);
  
  // Format historical data for chart
  const priceHistoryData = id && history[id] ? {
    labels: history[id].prices.map(price => {
      const date = new Date(price[0]);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Price (USD)',
        data: history[id].prices.map(price => price[1]),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  } : null;
  
  // Toggle favorite status
  const handleToggleFavorite = () => {
    if (id) {
      dispatch(toggleCryptoFavorite(id));
    }
  };
  
  if (!id || (detailsLoading && !selectedCrypto)) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{selectedCrypto?.name || 'Cryptocurrency'} Details - CryptoWeather Nexus</title>
        <meta name="description" content={`Detailed information about ${selectedCrypto?.name || 'cryptocurrency'}`} />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            Error loading cryptocurrency data: {error}
          </div>
        )}
        
        {selectedCrypto && (
          <>
            {/* Crypto Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div className="flex items-center">
                {selectedCrypto.image && (
                  <img 
                    src={selectedCrypto.image.small} 
                    alt={selectedCrypto.name} 
                    className="w-10 h-10 mr-3" 
                  />
                )}
                <h1 className="text-3xl font-bold">{selectedCrypto.name}</h1>
                <span className="text-gray-500 ml-2">({selectedCrypto.symbol.toUpperCase()})</span>
                
                <button 
                  onClick={handleToggleFavorite}
                  className="ml-4 text-yellow-500 focus:outline-none"
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  {isFavorite ? <FaStar size={24} /> : <FaRegStar size={24} />}
                </button>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <div className="text-2xl font-bold">
                  ${selectedCrypto.market_data?.current_price?.usd.toLocaleString()}
                </div>
                <div className={`text-sm font-medium ${
                  selectedCrypto.market_data?.price_change_percentage_24h > 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {selectedCrypto.market_data?.price_change_percentage_24h > 0 ? '+' : ''}
                  {selectedCrypto.market_data?.price_change_percentage_24h.toFixed(2)}% (24h)
                </div>
              </div>
            </div>
            
            {/* Price Chart */}
            <section className="mb-10">
              <h2 className="section-title">Price History (30 Days)</h2>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 h-80">
                {historyLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Spinner />
                  </div>
                ) : priceHistoryData ? (
                  <CryptoChart data={priceHistoryData} type="line" />
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    No historical data available
                  </div>
                )}
              </div>
            </section>
            
            {/* Market Data */}
            <section className="mb-10">
              <h2 className="section-title">Market Data</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card p-4">
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">Market Cap</h3>
                  <p className="text-xl font-bold">
                    ${selectedCrypto.market_data?.market_cap?.usd.toLocaleString()}
                  </p>
                </div>
                
                <div className="card p-4">
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">Trading Volume (24h)</h3>
                  <p className="text-xl font-bold">
                    ${selectedCrypto.market_data?.total_volume?.usd.toLocaleString()}
                  </p>
                </div>
                
                <div className="card p-4">
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">Circulating Supply</h3>
                  <p className="text-xl font-bold">
                    {selectedCrypto.market_data?.circulating_supply.toLocaleString()} {selectedCrypto.symbol.toUpperCase()}
                  </p>
                </div>
                
                <div className="card p-4">
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">All-Time High</h3>
                  <p className="text-xl font-bold">
                    ${selectedCrypto.market_data?.ath?.usd.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedCrypto.market_data?.ath_date?.usd).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="card p-4">
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">All-Time Low</h3>
                  <p className="text-xl font-bold">
                    ${selectedCrypto.market_data?.atl?.usd.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedCrypto.market_data?.atl_date?.usd).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="card p-4">
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">Price Change (7d)</h3>
                  <p className={`text-xl font-bold ${
                    selectedCrypto.market_data?.price_change_percentage_7d > 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {selectedCrypto.market_data?.price_change_percentage_7d > 0 ? '+' : ''}
                    {selectedCrypto.market_data?.price_change_percentage_7d.toFixed(2)}%
                  </p>
                </div>
              </div>
            </section>
            
            {/* Description */}
            {selectedCrypto.description?.en && (
              <section>
                <h2 className="section-title">About {selectedCrypto.name}</h2>
                <div className="card p-6">
                  <div 
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedCrypto.description.en }}
                  />
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </>
  );
}