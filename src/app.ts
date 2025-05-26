import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import rateLimit from 'express-rate-limit';
import accountRoutes from './routes/account.routes';
import { errorHandler } from './middleware/error.middleware';
import { requestLogger } from './middleware/logger.middleware';
import logger from './utils/logger';

const app = express();

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Replace with your actual domain
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// Rate limiting
app.use('/api', limiter);

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/static', express.static(path.join(__dirname, '../public')));

// Request logging
app.use(requestLogger);

// Serve HTML file with template replacement
app.get('/', (req, res) => {
  try {
    const htmlPath = path.join(__dirname, '../public/index.html');
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // Replace template variables
    html = html.replace('{{NODE_ENV}}', process.env.NODE_ENV || 'development');
    html = html.replace('{{PORT}}', process.env.PORT || '3000');
    
    res.send(html);
  } catch (error) {
    logger.error('Error serving HTML file:', error);
    res.status(500).json({ error: 'Unable to load welcome page' });
  }
});

// API Routes
app.use('/api/accounts', accountRoutes);

// Enhanced health check endpoint
app.get('/health', (req, res) => {
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    },
    nodeVersion: process.version
  };
  
  res.status(200).json(healthData);
});

// Enhanced API info endpoint
app.get('/api/info', (req, res) => {
  res.status(200).json({
    name: 'Finable API',
    version: '1.0.0',
    description: 'Secure Financial Account Management API with enterprise-grade encryption',
    author: 'Finable Team',
    documentation: '/api/docs',
    endpoints: {
      'POST /api/accounts': {
        description: 'Create a new financial account',
        requiresAuth: false,
        rateLimit: '100 requests per 15 minutes'
      },
      'GET /api/accounts/:accountNumber': {
        description: 'Retrieve account by account number',
        requiresAuth: false,
        rateLimit: '100 requests per 15 minutes'
      },
      'GET /api/accounts': {
        description: 'List all accounts with encrypted/decrypted views',
        requiresAuth: false,
        rateLimit: '100 requests per 15 minutes'
      },
      'POST /api/accounts/decrypt': {
        description: 'Decrypt encrypted data using provided keys',
        requiresAuth: false,
        rateLimit: '100 requests per 15 minutes'
      },
      'GET /health': {
        description: 'System health check with detailed metrics',
        requiresAuth: false,
        rateLimit: 'unlimited'
      },
      'GET /': {
        description: 'Interactive welcome page with API documentation',
        requiresAuth: false,
        rateLimit: 'unlimited'
      },
      'GET /api/info': {
        description: 'Detailed API information and endpoint documentation',
        requiresAuth: false,
        rateLimit: 'unlimited'
      }
    },
    features: [
      'AES-256-GCM Field-Level Encryption',
      'Automatic Account & Card Generation',
      'Comprehensive Request Logging',
      'Rate Limiting & Security Headers',
      'Real-time Health Monitoring',
      'Interactive API Testing',
      'CORS Protection',
      'Input Validation & Sanitization'
    ],
    security: {
      encryption: 'AES-256-GCM',
      rateLimiting: 'Express Rate Limit',
      headers: 'Helmet.js',
      validation: 'express-validator',
      cors: 'Configurable CORS'
    },
    status: 'online',
    lastUpdated: new Date().toISOString()
  });
});

// Enhanced 404 handler with better error information
app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl} from IP: ${req.ip}`);
  res.status(404).json({ 
    error: 'Route not found',
    message: `The requested route ${req.method} ${req.originalUrl} does not exist`,
    availableRoutes: [
      'GET /',
      'GET /api/info',
      'GET /health',
      'POST /api/accounts',
      'GET /api/accounts',
      'GET /api/accounts/:accountNumber',
      'POST /api/accounts/decrypt'
    ],
    suggestion: 'Check the API documentation at /api/info for available endpoints'
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

export default app;