import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import './index.css';
import ArticleDetails from './pages/ArticleDetails';
import { getBookmarks, isArticleBookmarked, toggleBookmarkArticle } from './utils/bookmarks';

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('general');
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState(getBookmarks());
  const location = useLocation();

  const categories = [
    { name: 'Home', slug: 'general' },
    { name: 'Technology', slug: 'technology' },
    { name: 'Business', slug: 'business' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Health', slug: 'health' },
    { name: 'World', slug: 'world' },
  ];
  const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Keep bookmarks in sync when other components update localStorage
  useEffect(() => {
    const handler = (e) => {
      setBookmarks(getBookmarks());
    };
    window.addEventListener('bookmarksUpdated', handler);
    // also listen to storage events (other tabs)
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('bookmarksUpdated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/news?category=${category}`)
      .then((res) => res.json())
      .then((data) => {
        setNews(data.articles || []);
        setLoading(false);
      })
      .catch(() => {
        setNews([]);
        setLoading(false);
      });
  }, [API_URL, category]);

  const toggleBookmark = (article) => {
    const nextBookmarks = toggleBookmarkArticle(article, bookmarks);
    setBookmarks(nextBookmarks);
  };

  const filteredNews = news.filter((article) =>
    article.title?.toLowerCase().includes(search.toLowerCase()) ||
    article.description?.toLowerCase().includes(search.toLowerCase())
  );

  const isBookmarked = (article) => isArticleBookmarked(article, bookmarks);

  const renderHomePage = () => (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {category.charAt(0).toUpperCase() + category.slice(1)} News
        </h2>
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {filteredNews.length} articles
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className={`text-center py-20 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No news found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((article, index) => (
            <div
              key={article.id || article.url || `${article.title}-${index}`}
              className={`rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="relative">
                <img
                  src={article.image || fallbackImage}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = fallbackImage;
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-semibold uppercase ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {article.category || 'General'}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleBookmark(article)}
                    className="text-xl hover:scale-125 transition"
                  >
                    {isBookmarked(article) ? '❤️' : '🤍'}
                  </button>
                </div>
                <h3 className={`font-semibold mt-2 line-clamp-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {article.title}
                </h3>
                <p className={`text-sm mt-2 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {article.description || 'No description'}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {article.source?.name || 'Unknown'}
                  </span>
                  <Link
                    to={`/article/${encodeURIComponent(article.id || article.url || article.title)}`}
                    className={`text-sm font-medium transition ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderBookmarksPage = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Saved bookmarks
        </h2>
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {bookmarks.length} saved
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <div className={`rounded-xl border p-8 text-center ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
          No bookmarks yet. Tap the heart on any article to save it.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((article, index) => (
            <div
              key={article.id || article.url || `${article.title}-${index}`}
              className={`rounded-xl shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <img
                src={article.image || fallbackImage}
                alt={article.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = fallbackImage;
                }}
              />
              <div className="p-4">
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {article.title}
                </h3>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {article.description || 'No description'}
                </p>
                <div className="flex items-center justify-between">
                  <Link
                    to={`/article/${encodeURIComponent(article.id || article.url || article.title)}`}
                    className={`text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    Read More →
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleBookmark(article)}
                    className="text-xl"
                  >
                    ❤️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <nav className={`sticky top-0 z-50 shadow-lg transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className={`text-2xl font-bold transition-colors ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              NewsSphere
            </Link>

            <div className="hidden md:flex items-center space-x-3">
              <div className="hidden lg:flex space-x-6">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setCategory(cat.slug)}
                    className={`text-sm font-medium transition-colors ${
                      category === cat.slug
                        ? `border-b-2 border-blue-600 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                        : darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <Link
                to="/bookmarks"
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                🔖 Bookmarks
              </Link>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-56 max-w-xs px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileNavOpen ? '✕' : '☰'}
            </button>
          </div>

          {mobileNavOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        setCategory(cat.slug);
                        setMobileNavOpen(false);
                      }}
                      className={`px-3 py-1 text-xs rounded-full transition ${
                        category === cat.slug
                          ? 'bg-blue-600 text-white'
                          : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    to="/bookmarks"
                    className={`block w-full text-center rounded-lg px-4 py-2 text-sm font-medium transition ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    🔖 Bookmarks
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                  >
                    Toggle {darkMode ? 'Light' : 'Dark'} Mode
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Routes>
          <Route path="/" element={renderHomePage()} />
          <Route path="/bookmarks" element={renderBookmarksPage()} />
          <Route path="/article/:id" element={<ArticleDetails />} />
        </Routes>
      </main>

      <footer className={`mt-12 border-t transition-colors duration-300 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2026 NewsSphere. All rights reserved.</p>
            <p className="mt-1">📚 {bookmarks.length} bookmarks saved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;