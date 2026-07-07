import React, { useState, useEffect } from 'react';
import NewsCard from '../components/news/NewsCard';
import { getBookmarks } from '../utils/bookmarks';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState(getBookmarks());

  useEffect(() => {
    const saved = getBookmarks();
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
            <NewsCard
              key={article.id || article.url || `${article.title}-${index}`}
              article={article}
              showBookmark={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;