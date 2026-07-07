import React, { useState, useEffect } from 'react';

const BreakingNews = ({ articles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!articles || articles.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [articles]);

  if (!articles || articles.length === 0) return null;

  return (
    <div className="bg-red-600 dark:bg-red-700 rounded-lg p-3 mb-6 flex items-center overflow-hidden">
      <span className="bg-white text-red-600 font-bold px-3 py-1 rounded-md text-sm whitespace-nowrap mr-3">
        ⚡ BREAKING
      </span>
      <div className="flex-1 overflow-hidden">
        <p className="text-white text-sm font-medium animate-marquee whitespace-nowrap">
          {articles[currentIndex]?.title || 'Latest news updates...'}
        </p>
      </div>
    </div>
  );
};

export default BreakingNews;