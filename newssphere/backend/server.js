const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ✅ NEWS ROUTES IMPORT KARO
const newsRoutes = require('./src/routes/newsRoutes');

// ✅ USE KARO
app.use('/api/news', newsRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Backend is working!', 
    timestamp: new Date().toISOString() 
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Test: http://localhost:${PORT}/api/test`);
  console.log(`📰 News: http://localhost:${PORT}/api/news`);
}); 