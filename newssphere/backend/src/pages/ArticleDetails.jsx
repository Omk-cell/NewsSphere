import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchNews } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ArticleDetails = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      const data = await fetchNews('general');
      const found = data.articles?.find((a, index) => index.toString() === id);
      setArticle(found || null);
      setLoading(false);
    };
    loadArticle();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!article) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400">Article not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <img
        src={article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop'}
        alt={article.title}
        className="w-full h-64 md:h-96 object-cover rounded-xl mb-6"
      />
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {article.title}
      </h1>
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <span>{article.source?.name || 'Unknown'}</span>
        <span>•</span>
        <span>{article.category || 'General'}</span>
        {article.publishedAt && (
          <>
            <span>•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </>
        )}
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
        {article.description || article.content || 'No content available'}
      </p>
    </div>
  );
};

export default ArticleDetails;