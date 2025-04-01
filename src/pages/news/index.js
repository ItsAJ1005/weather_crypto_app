import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import { fetchNewsData } from '../../store/slices/newsSlice';
import Layout from '../../components/Layout';
import NewsCard from '../../components/news/NewsCard';
import { FaArrowLeft, FaSyncAlt } from 'react-icons/fa';
import { format } from 'date-fns';

const NewsPage = () => {
  const dispatch = useDispatch();
  const { articles, loading, error } = useSelector((state) => state.news);
  
  useEffect(() => {
    if (articles.length === 0 && !loading) {
      dispatch(fetchNewsData());
    }
  }, [articles, loading, dispatch]);
  
  const handleRefresh = () => {
    dispatch(fetchNewsData());
  };
  
  return (
    <Layout>
      <Head>
        <title>Crypto News | CryptoWeather Nexus</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/" className="mr-4 text-primary-600 hover:text-primary-800">
              <FaArrowLeft />
            </Link>
            <h1 className="text-3xl font-bold">Cryptocurrency News</h1>
          </div>
          
          <button
            onClick={handleRefresh}
            className="flex items-center bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded"
            disabled={loading}
          >
            <FaSyncAlt className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-200">
            Error loading news: {error}
          </div>
        ) : articles.length > 0 ? (
          <div className="space-y-6">
            {articles.map((article, index) => (
              <div 
                key={article.article_id || index} 
                className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <NewsCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            No news articles available. Try refreshing.
          </div>
        )}
        
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-4">About Crypto News</h2>
          <p className="mb-4">
            Stay up-to-date with the latest happenings in the cryptocurrency world. Our news section 
            aggregates top headlines from trusted sources to keep you informed about market trends, 
            regulatory developments, and technological breakthroughs.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {articles.length > 0 ? format(new Date(), 'MMM d, yyyy h:mm a') : 'Never'}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default NewsPage;