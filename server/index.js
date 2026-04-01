/**
 * JP Furnishing — Local Node.js Development Server
 * Imports the express app from app.js and starts a local listener
 */

import app from './app.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env for the local listener
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.SERVER_PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 JP Furnishing API running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   OpenAI: ${process.env.VITE_OPENAI_API_KEY ? '✅ Key found' : '⚠️ No key — chatbot will use fallback'}`);
});
