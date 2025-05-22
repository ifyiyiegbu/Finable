import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const config = {
  mongoUri: process.env.MONGODB_URI,
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  encryptionKey: process.env.ENCRYPTION_KEY,
  logLevel: process.env.LOG_LEVEL || 'info',
};


// Validate critical config
if (!config.encryptionKey) {
  throw new Error('ENCRYPTION_KEY environment variable is required');
}


export default config;
