import React, { useState, useEffect } from 'react';
import NewsCard from '../components/news/NewsCard';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarks(saved);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        📚 Your Bookmarks
      </h2>
      {bookmarks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No bookmarks yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;