import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { chatRoute } from './routes/chat.js';
import { searchRoute } from './routes/search.js';
import { recommendationsRoute } from './routes/recommendations.js';

// ES Module dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env — check both local and parent for flexibility
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// ─── MIDDLEWARE ───
app.use(cors({
  origin: '*', // Allow all for serverless, or configure specifically
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// Stricter rate limit for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'AI rate limit exceeded. Please wait a moment.' },
});

// ─── ROUTES ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

app.use('/api/chat', aiLimiter, chatRoute);
app.use('/api/search', searchRoute);
app.use('/api/recommendations', recommendationsRoute);

// ─── ERROR HANDLER ───
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

export default app;
