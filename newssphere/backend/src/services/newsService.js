const axios = require('axios');
const Parser = require('rss-parser');
const parser = new Parser();

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const SECONDARY_NEWS_API_KEY = process.env.SECONDARY_NEWS_API_KEY;
const NEWS_API_PAGE_SIZE = 30;

const mapCategoryForNewsApi = category => {
  const supported = new Set([
    'business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'
  ]);
  return supported.has(category) ? category : 'general';
};

const buildNewsApiUrl = (category, apiKey) => {
  const mappedCategory = mapCategoryForNewsApi(category);
  const params = new URLSearchParams({
    apiKey,
    pageSize: `${NEWS_API_PAGE_SIZE}`,
    language: 'en'
  });

  if (mappedCategory !== 'general') {
    params.set('category', mappedCategory);
  }

  if (category === 'world') {
    params.delete('category');
    params.set('q', 'world');
  }

  return `https://newsapi.org/v2/top-headlines?${params.toString()}`;
};

const transformNewsApiArticles = (articles, category) =>
  articles.map(item => ({
    title: item.title || 'No Title',
    description: item.description || item.content || '',
    content: item.content || item.description || '',
    image: item.urlToImage || null,
    category: category === 'world' ? 'world' : mapCategoryForNewsApi(category),
    source: {
      name: item.source?.name || 'NewsAPI',
      url: item.url || ''
    },
    url: item.url || '',
    publishedAt: item.publishedAt || new Date().toISOString(),
    isCustom: false
  }));

const fetchFromNewsApi = async (category = 'general') => {
  const apiKeys = [NEWS_API_KEY, SECONDARY_NEWS_API_KEY].filter(Boolean);
  if (!apiKeys.length) {
    throw new Error('No NEWS_API_KEY configured');
  }

  for (const apiKey of apiKeys) {
    try {
      const url = buildNewsApiUrl(category, apiKey);
      console.log(`🔑 Fetching news from NewsAPI with key ${apiKey.slice(-8)}...`);
      const response = await axios.get(url, { timeout: 10000 });

      if (response?.data?.articles?.length) {
        return transformNewsApiArticles(response.data.articles, category);
      }

      console.warn('NewsAPI returned no articles, trying next key if available.');
    } catch (error) {
      console.warn(`NewsAPI key failed (${apiKey.slice(-8)}):`, error.message);
    }
  }

  throw new Error('All NewsAPI keys failed');
};

// ===== RSS FEEDS WITH CATEGORIES =====
const fetchFromRSS = async () => {
  try {
    // Category-wise RSS feeds
    const feeds = [
      { url: 'https://feeds.bbci.co.uk/news/rss.xml', category: 'general' },
      { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', category: 'technology' },
      { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', category: 'business' },
      { url: 'https://feeds.bbci.co.uk/sport/rss.xml', category: 'sports' },
      { url: 'https://feeds.bbci.co.uk/news/health/rss.xml', category: 'health' },
      { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', category: 'world' },
      { url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', category: 'general' }
    ];

    let allArticles = [];

    for (const feed of feeds) {
      try {
        const parsed = await parser.parseURL(feed.url);
        const articles = parsed.items.slice(0, 10).map(item => ({
          title: item.title || 'No Title',
          description: item.contentSnippet || item.title || '',
          content: item.content || '',
          image: item.enclosure?.url || null,
          category: feed.category,
          source: {
            name: parsed.title || 'RSS Feed',
            url: item.link || ''
          },
          url: item.link || '',
          publishedAt: item.pubDate || new Date().toISOString(),
          isCustom: false
        }));
        allArticles = [...allArticles, ...articles];
      } catch (err) {
        console.error(`RSS Error (${feed.url}):`, err.message);
      }
    }

    return allArticles;
  } catch (error) {
    console.error('RSS Parser Error:', error.message);
    return [];
  }
};

// ===== MAIN AGGREGATOR =====
const aggregateNews = async (category = 'general') => {
  console.log(`📰 Fetching news for category: ${category}`);

  let allArticles = [];

  if (NEWS_API_KEY || SECONDARY_NEWS_API_KEY) {
    try {
      allArticles = await fetchFromNewsApi(category);
    } catch (error) {
      console.warn('NewsAPI fallback triggered:', error.message);
      allArticles = await fetchFromRSS();
    }
  } else {
    allArticles = await fetchFromRSS();
  }

  let filteredArticles = allArticles;
  if (category !== 'general') {
    filteredArticles = allArticles.filter(article => article.category === category);
  }

  const seen = new Set();
  filteredArticles = filteredArticles.filter(article => {
    const key = article.title.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`✅ Fetched ${filteredArticles.length} articles for ${category}`);
  return filteredArticles.slice(0, 30);
};

module.exports = {
  fetchFromRSS,
  aggregateNews
};