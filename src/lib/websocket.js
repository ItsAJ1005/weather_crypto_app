import { addNotification } from '../store/slices/uiSlice';
import { updateCryptoPrice, addPriceAlert } from '../store/slices/cryptoSlice';
import { addWeatherAlert } from '../store/slices/weatherSlice';

class WebSocketClient {
  constructor(store) {
    this.socket = null;
    this.store = store;
    this.connected = false;
    this.reconnectTimer = null;
    this.reconnectInterval = 5000; // 5 seconds
    this.cryptoIds = ['bitcoin', 'ethereum', 'ripple'];
  }

  connect() {
    // Connect to CoinCap WebSocket for crypto prices
    this.socket = new WebSocket(`wss://ws.coincap.io/prices?assets=${this.cryptoIds.join(',')}`);
    
    this.socket.onopen = () => {
      this.connected = true;
      console.log('WebSocket connected');
      
      // Dispatch notification
      this.store.dispatch(addNotification({
        type: 'info',
        title: 'WebSocket Connected',
        message: 'Real-time updates are now active',
      }));
      
      // Clear any reconnect timer
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      
      // Set up weather alert simulation
      this.startWeatherAlertSimulation();
    };
    
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Process crypto price updates
        Object.entries(data).forEach(([id, price]) => {
          const numericPrice = parseFloat(price);
          
          // Convert CoinCap's id format to our format if needed
          const cryptoId = id.replace(/-/g, '');
          
          // Get current price from store
          const currentState = this.store.getState();
          const crypto = currentState.crypto.cryptos.find(c => c.id === cryptoId);
          
          if (crypto) {
            const oldPrice = crypto.current_price;
            const priceDiff = numericPrice - oldPrice;
            const priceChangePercentage = (priceDiff / oldPrice) * 100;
            
            // Update the price in the store
            this.store.dispatch(updateCryptoPrice({
              id: cryptoId,
              price: numericPrice,
              priceChange24h: crypto.price_change_24h, // Preserve existing 24h change
            }));
            
            // Check if price change is significant (more than 0.5%)
            if (Math.abs(priceChangePercentage) > 0.5) {
              const alert = {
                id: cryptoId,
                oldPrice,
                newPrice: numericPrice,
                change: priceChangePercentage,
                timestamp: Date.now(),
              };
              
              // Add to price alerts
              this.store.dispatch(addPriceAlert(alert));
              
              // Send notification
              this.store.dispatch(addNotification({
                type: 'price_alert',
                title: `${crypto.name} Price Alert`,
                message: `Price ${priceChangePercentage > 0 ? 'increased' : 'decreased'} by ${Math.abs(priceChangePercentage).toFixed(2)}% to $${numericPrice.toLocaleString()}`,
                variant: priceChangePercentage > 0 ? 'success' : 'error',
              }));
            }
          }
        });
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    this.socket.onclose = () => {
      this.connected = false;
      console.log('WebSocket disconnected');
      
      // Set up reconnect
      this.reconnectTimer = setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    };
    
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.socket.close();
    };
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.weatherAlertTimer) {
      clearInterval(this.weatherAlertTimer);
      this.weatherAlertTimer = null;
    }
  }
  
  startWeatherAlertSimulation() {
    // Simulate weather alerts every 30-90 seconds
    this.weatherAlertTimer = setInterval(() => {
      const currentState = this.store.getState();
      if (currentState.weather.cities.length > 0) {
        const cities = currentState.weather.cities;
        const randomCityIndex = Math.floor(Math.random() * cities.length);
        const city = cities[randomCityIndex];
        
        const alertTypes = [
          { type: 'rain', message: 'Heavy rain expected' },
          { type: 'snow', message: 'Snow showers expected' },
          { type: 'wind', message: 'Strong winds expected' },
          { type: 'temp', message: 'Temperature drop expected' },
          { type: 'storm', message: 'Thunderstorm warnings' },
        ];
        
        const randomAlertIndex = Math.floor(Math.random() * alertTypes.length);
        const alert = alertTypes[randomAlertIndex];
        
        // Add to weather alerts
        this.store.dispatch(addWeatherAlert({
          city: city.name,
          type: alert.type,
          message: alert.message,
          timestamp: Date.now(),city: city.name,
          type: alert.type,
          message: alert.message,
          timestamp: Date.now(),
        }));
        
        // Send notification
        this.store.dispatch(addNotification({
          type: 'weather_alert',
          title: `Weather Alert for ${city.name}`,
          message: alert.message,
          variant: 'warning',
        }));
      }
    }, Math.floor(Math.random() * 60000) + 30000); // Random interval between 30-90 seconds
  }
}

let webSocketInstance = null;

export const initWebSocket = (store) => {
  if (!webSocketInstance) {
    webSocketInstance = new WebSocketClient(store);
    webSocketInstance.connect();
  }
  return webSocketInstance;
};

export const getWebSocketInstance = () => webSocketInstance;

export default WebSocketClient;