import { Router } from 'express';
import { 
  createAccountHandler, 
  getAccountHandler, 
  getAllAccountsHandler, 
  decryptDataHandler 
} from '../controllers/account.controller';
import { validateCreateAccount, validate } from '../middleware/validation.middleware';

const router = Router();

/**
 * @route   POST /api/accounts
 * @desc    Create a new account
 * @access  Public
 */
router.post('/', validateCreateAccount(), validate, createAccountHandler);

/**
 * @route   GET /api/accounts/:accountNumber
 * @desc    Get account details
 * @access  Public (should be protected in production)
 */
router.get('/:accountNumber', getAccountHandler);

/**
 * @route   GET /api/accounts
 * @desc    List all accounts with encrypted and decrypted data
 * @access  Public (should be protected in production)
 */
router.get('/', getAllAccountsHandler);

/**
 * @route   POST /api/accounts/decrypt
 * @desc    Decrypt encrypted data
 * @access  Public (should be protected in production)
 */
router.post('/decrypt', decryptDataHandler);

export default router;
