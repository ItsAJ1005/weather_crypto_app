import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import { removeNotification } from '../store/slices/uiSlice';
import { initWebSocket } from '../lib/websocket';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const { notifications, theme } = useSelector((state) => state.ui);
  
  // Initialize theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  // Initialize WebSocket
  useEffect(() => {
    const socket = initWebSocket(dispatch);
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [dispatch]);
  
  // Show notifications
  useEffect(() => {
    notifications.forEach((notification) => {
      if (!notification.displayed) {
        // Determine toast type based on notification variant
        const toastType = (() => {
          switch (notification.variant) {
            case 'success': return toast.SUCCESS;
            case 'error': return toast.ERROR;
            case 'warning': return toast.WARNING;
            default: return toast.INFO;
          }
        })();
        
        // Show toast
        toast(
          <div>
            <h4 className="font-bold">{notification.title}</h4>
            <p>{notification.message}</p>
          </div>,
          {
            type: toastType,
            toastId: notification.id,
            onClose: () => dispatch(removeNotification(notification.id)),
          }
        );
        
        // Mark as displayed
        notification.displayed = true;
      }
    });
  }, [notifications, dispatch]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} CryptoWeather Nexus | All data provided for informational purposes only
          </p>
        </div>
      </footer>
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
        theme={theme}
      />
    </div>
  );
};

export default Layout;