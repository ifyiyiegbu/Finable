import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/bankingApi',
  encryptionKey: process.env.ENCRYPTION_KEY,
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate critical config
if (!config.encryptionKey) {
  throw new Error('ENCRYPTION_KEY environment variable is required');
}

export default config;
