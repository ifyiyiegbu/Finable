import crypto from 'crypto';
import { getEncryptionKey } from '../config/encryption';
import { IEncryptedData } from '../interfaces/account.interface';
import logger from '../utils/logger';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Recommended length for GCM IVs

export const encrypt = (text: string): IEncryptedData => {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = getEncryptionKey();

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
      encryptedData: encrypted.toString('hex'),
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  } catch (error) {
    logger.error('Encryption error in encrypt():', error);
    throw new Error('Failed to encrypt data');
  }
};

export const decrypt = (encryptedData: string, iv: string, authTag: string): string => {
  try {
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'hex'));

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedData, 'hex')),
      decipher.final()
    ]);

    return decrypted.toString('utf8');
  } catch (error) {
    logger.error('Decryption error in decrypt():', error);
    throw new Error('Failed to decrypt data');
  }
};

export const decryptData = (encryptedObject: IEncryptedData): string => {
  return decrypt(encryptedObject.encryptedData, encryptedObject.iv, encryptedObject.authTag);
};
