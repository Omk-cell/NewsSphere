import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('general');
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState('');
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const categories = [
    { name: 'Home', slug: 'general' },
    { name: 'Technology', slug: 'technology' },
    { name: 'Business', slug: 'business' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Health', slug: 'health' },
    { name: 'World', slug: 'world' },
  ];

  // Dark mode effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  // Fetch news
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/news?category=${category}`)
      .then(res => res.json())
      .then(data => {
        setNews(data.articles || []);
        setLoading(false);
      })
      .catch(() => {
        setNews([]);
        setLoading(false);
      });
  }, [category]);

  // Toggle bookmark
  const toggleBookmark = (article) => {
    const exists = bookmarks.some(b => b.title === article.title);
    const newBookmarks = exists 
      ? bookmarks.filter(b => b.title !== article.title)
      : [...bookmarks, article];
    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  };

  // Filter news by search
  const filteredNews = news.filter(article =>
    article.title?.toLowerCase().includes(search.toLowerCase()) ||
    article.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Check if article is bookmarked
  const isBookmarked = (article) => {
    return bookmarks.some(b => b.title === article.title);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      
      {/* ===== NAVBAR ===== */}
      <nav className={`sticky top-0 z-50 shadow-lg transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className={`text-2xl font-bold transition-colors ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              NewsSphere
            </h1>

            <div className="hidden md:flex space-x-6">
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

            <div className="flex items-center space-x-3">
              {/* Search */}
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          {/* Mobile Categories */}
          <div className="md:hidden flex flex-wrap gap-2 py-2">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setCategory(cat.slug)}
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
        </div>
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {category.charAt(0).toUpperCase() + category.slice(1)} News
          </h2>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {filteredNews.length} articles
          </span>
        </div>

        {/* Loading */}
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
                key={index}
                className={`rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
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
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-semibold uppercase ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {article.category || 'General'}
                    </span>
                    <button
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
                    <button className={`text-sm font-medium transition ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className={`mt-12 border-t transition-colors duration-300 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
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