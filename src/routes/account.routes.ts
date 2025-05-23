import { Router } from 'express';
import { 
  createAccountHandler, 
  getAccountHandler, 
  getAllAccountsHandler, 
  decryptDataHandler 
} from '../controllers/account.controller';
import { validateCreateAccount, validate } from '../middleware/validation.middleware';

const router = Router();

router.post('/', validateCreateAccount(), validate, createAccountHandler);

router.get('/:accountNumber', getAccountHandler);

router.get('/', getAllAccountsHandler);

router.post('/decrypt', decryptDataHandler);

export default router;
