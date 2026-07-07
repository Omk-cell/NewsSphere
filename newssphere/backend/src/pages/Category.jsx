import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchNews } from '../services/api';
import NewsCard from '../components/news/NewsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Category = () => {
  const { category } = useParams();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const data = await fetchNews(category);
      setNews(data.articles || []);
      setLoading(false);
    };
    loadNews();
  }, [category]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 capitalize">
        {category} News
      </h2>
      {news.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No news found for {category}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;