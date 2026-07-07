const express = require('express');
const router = express.Router();
const { aggregateNews } = require('../services/newsService');

// GET /api/news
router.get('/', async (req, res) => {
  try {
    const { category = 'general', limit = 20 } = req.query;
    
    const articles = await aggregateNews(category);
    
    const limitedArticles = articles.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      count: limitedArticles.length,
      category: category,
      articles: limitedArticles
    });
    
  } catch (error) {
    console.error('Route Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message
    });
  }
});

// GET /api/news/categories
router.get('/categories', (req, res) => {
  const categories = [
    'general', 'technology', 'business', 'sports', 'health', 'world'
  ];
  res.json({
    success: true,
    categories
  });
});

module.exports = router;