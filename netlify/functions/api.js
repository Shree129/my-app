import serverless from 'serverless-http';
import app from '../../server/app.js';

// The handler for Netlify Functions
export const handler = serverless(app);
