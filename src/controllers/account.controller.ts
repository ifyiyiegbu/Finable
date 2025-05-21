import { Request, Response, NextFunction } from 'express';
import { 
  createAccount, 
  getAccountByNumber, 
  formatAccountResponse,
  getAllAccounts,
  decryptEncryptedData
} from '../services/account.service';
import { ICreateAccountDto, IEncryptedData } from '../interfaces/account.interface';
import logger from '../utils/logger';

export const createAccountHandler = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const accountData: ICreateAccountDto = req.body;
    
    const { account, decryptedData } = await createAccount(accountData);
    
    const response = {
      message: 'Account created successfully',
      account: formatAccountResponse(account, decryptedData)
    };
    
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getAccountHandler = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const { accountNumber } = req.params;
    
    const { account, decryptedData } = await getAccountByNumber(accountNumber);
    
    const response = formatAccountResponse(account, decryptedData);
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getAllAccountsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accounts = await getAllAccounts();
    
    res.status(200).json({
      count: accounts.length,
      accounts
    });
  } catch (error) {
    next(error);
  }
};

export const decryptDataHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const encryptedData: IEncryptedData = req.body;
    
    // Validate request
    if (!encryptedData || !encryptedData.encryptedData || !encryptedData.iv) {
      res.status(400).json({ 
        message: 'Invalid request. Required fields: encryptedData, iv' 
      });
      return;
    }
    
    const decryptedData = decryptEncryptedData(encryptedData);
    
    res.status(200).json({
      decryptedData
    });
  } catch (error) {
    next(error);
  }
};