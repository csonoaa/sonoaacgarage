// Vercel API adapter for serverless functions
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { registerRoutes } from '../server/routes.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "https://carmarketvaluator.com",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes without creating an HTTP server
app.api = {};
registerRoutes(app);

// Error handling
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ success: false, message });
});

// Handler for Vercel serverless function
export default async function handler(req, res) {
  // Log incoming request
  console.log(`API Request: ${req.method} ${req.url}`);
  
  // Mimic Express routing
  return new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) {
        console.error('Express error:', err);
        reject(err);
        return;
      }
      resolve();
    });
  });
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
} 