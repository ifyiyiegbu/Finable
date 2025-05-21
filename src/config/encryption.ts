import config from './index';

const getEncryptionKey = (): Buffer => {
  if (!config.encryptionKey) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }

  const keyBuffer = Buffer.from(config.encryptionKey, 'hex');

  if (keyBuffer.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes)');
  }

  return keyBuffer;
};

export { getEncryptionKey };
