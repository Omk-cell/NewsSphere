import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchNews } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getBookmarks, isArticleBookmarked, toggleBookmarkArticle } from '../utils/bookmarks';

const ArticleDetails = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState(getBookmarks());

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      try {
        const data = await fetchNews('general');
        const articles = data.articles || [];

        // Decode the id from the route (react-router may give a decoded string),
        // and strip any surrounding single/double quotes that sometimes appear.
        const decodedIdRaw = typeof id === 'string' ? decodeURIComponent(id) : String(id || '');
        const decodedId = decodedIdRaw.replace(/^['\"]|['\"]$/g, '');

        const found = articles.find((item, index) => {
          const key = item.id || item.url || item.title || String(index);
          if (!key) return false;

          // Direct match against the decoded id
          if (String(key) === decodedId) return true;

          // Also accept an index match (if user navigated by numeric index)
          if (index.toString() === decodedId) return true;

          return false;
        });

        setArticle(found || null);
      } catch (error) {
        console.error('Failed to load article', error);
        setArticle(null);
      }
      setLoading(false);
    };

    loadArticle();
  }, [id]);

  const handleBookmark = () => {
    const nextBookmarks = toggleBookmarkArticle(article, bookmarks);
    setBookmarks(nextBookmarks);
  };

  if (loading) return <LoadingSpinner />;

  if (!article) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400">Article not found</p>
      </div>
    );
  }

  const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop';
  const bookmarked = isArticleBookmarked(article, bookmarks);

  return (
    <div className="max-w-4xl mx-auto">
      <img
        src={article.image || fallbackImage}
        alt={article.title}
        className="w-full h-64 md:h-96 object-cover rounded-xl mb-6"
        onError={(e) => {
          e.target.src = fallbackImage;
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBookmark}
            className="rounded-full border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {bookmarked ? '💖 Saved' : '🤍 Save'}
          </button>
          <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            ← Back to news
          </Link>
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {article.title}
      </h1>
      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
        {article.description || article.content || 'No content available'}
      </p>
    </div>
  );
};

export default ArticleDetails;