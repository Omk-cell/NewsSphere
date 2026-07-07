import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading news...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;