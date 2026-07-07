import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const NewsCard = ({ article }) => {
  const { title, description, image, source, publishedAt, category, id } = article;

  const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop';

  return (
    <div className="news-card group">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={image || fallbackImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">
          {category || 'General'}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Source & Time */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span className="font-medium">{source?.name || 'Unknown'}</span>
          {publishedAt && (
            <span>{formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
          {description || 'Click to read full article...'}
        </p>

        {/* Read More */}
        <Link
          to={`/article/${id || '#'}`}
          className="inline-flex items-center text-primary font-medium text-sm hover:text-blue-700 transition-colors group-hover:translate-x-1 transform duration-200"
        >
          Read More
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;