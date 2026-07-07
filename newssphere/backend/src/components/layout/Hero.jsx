import React from 'react';
import { Link } from 'react-router-dom';

const Hero = ({ featuredArticle }) => {
  if (!featuredArticle) return null;

  const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop';

  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-2/3 h-64 md:h-auto relative">
          <img
            src={featuredArticle.image || fallbackImage}
            alt={featuredArticle.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = fallbackImage;
            }}
          />
          <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
            🔥 Breaking
          </span>
        </div>

        {/* Content */}
        <div className="md:w-1/3 p-6 md:p-8 flex flex-col justify-center">
          <span className="text-sm text-primary font-semibold uppercase mb-2">
            {featuredArticle.category || 'Featured'}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-3">
            {featuredArticle.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {featuredArticle.description || 'Read the full story...'}
          </p>
          <Link
            to={`/article/${featuredArticle.id || '#'}`}
            className="inline-flex items-center justify-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors w-fit"
          >
            Read Full Story
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;