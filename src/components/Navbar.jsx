import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/slices/uiSlice';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useSelector((state) => state.ui);
  
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const isActive = (path) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Crypto', path: '/crypto' },
    { name: 'Weather', path: '/weather' },
    { name: 'News', path: '/news' },
  ];
  
  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                CryptoWeather Nexus
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Theme toggle */}
              <button
                onClick={handleToggleTheme}
                className="p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
              </button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(item.path)
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-200'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={closeMenu}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Theme toggle for mobile */}
          <button
            onClick={handleToggleTheme}
            className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? (
              <>
                <FaSun size={20} className="mr-2" /> Light Mode
              </>
            ) : (
              <>
                <FaMoon size={20} className="mr-2" /> Dark Mode
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;