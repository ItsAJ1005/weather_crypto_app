import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import Layout from '../components/Layout';
import WebSocketClient from '../lib/websocket';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';

// Initialize WebSocket
let websocket;

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize and connect WebSocket when app loads
    websocket = new WebSocketClient(store);
    websocket.connect();
    
    // Setup interval for periodic data refresh (every 60 seconds)
    const refreshInterval = setInterval(() => {
      const state = store.getState();
      
      // Dispatch actions to refresh data if needed
      if (!state.crypto.loading) {
        store.dispatch({ type: 'crypto/fetchCryptoData/pending' });
      }
      if (!state.weather.loading) {
        store.dispatch({ type: 'weather/fetchWeatherData/pending' });
      }
      if (!state.news.loading) {
        store.dispatch({ type: 'news/fetchNewsData/pending' });
      }
    }, 60000);
    
    // Clean up on unmount
    return () => {
      if (websocket) {
        websocket.disconnect();
      }
      clearInterval(refreshInterval);
    };
  }, []);
  
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Layout>
    </Provider>
  );
}

export default MyApp;