import React, { useState, useEffect } from 'react';
import { fetchNews } from '../services/api';

const Home = ({ category = 'general' }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      console.log('📰 Fetching for:', category);
      setLoading(true);
      try {
        const data = await fetchNews(category);
        console.log('✅ Data:', data);
        setNews(data.articles || []);
      } catch (err) {
        console.error('❌ Error:', err);
      }
      setLoading(false);
    };
    loadNews();
  }, [category]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // No news
  if (news.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400">No news found for "{category}"</p>
      </div>
    );
  }

  // Display news
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((article, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition hover:-translate-y-1">
          {article.image && (
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop';
              }}
            />
          )}
          <div className="p-4">
            <span className="text-xs font-semibold text-blue-600 uppercase">
              {article.category || 'General'}
            </span>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mt-2 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
              {article.description || 'No description'}
            </p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {article.source?.name || 'Unknown'}
              </span>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Read More →
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;