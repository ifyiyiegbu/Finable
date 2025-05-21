import mongoose from 'mongoose';
import config from './index';
import logger from '../utils/logger';

const connectDB = async (): Promise<void> => {
  try {
    if (!config.mongoUri) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }
    await mongoose.connect(config.mongoUri);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;