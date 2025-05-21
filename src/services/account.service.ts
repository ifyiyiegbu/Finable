import Account from '../models/account.model';
import { 
  IAccount, 
  ICreateAccountDto, 
  IEncryptedData, 
  IAccountResponse,
  IAccountListResponse
} from '../interfaces/account.interface';
import { encrypt, decrypt, decryptData } from './encryption.service';
import logger from '../utils/logger';

export const generateAccountNumber = (): string => {
  // Generate a random 10-digit number
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

export const generateCardNumber = (): string => {
  // Generate a random 16-digit number
  let cardNumber = '';
  for (let i = 0; i < 4; i++) {
    cardNumber += Math.floor(1000 + Math.random() * 9000).toString();
  }
  return cardNumber;
};

export const generateCVV = (): string => {
  // Generate a random 3-digit CVV
  return Math.floor(100 + Math.random() * 900).toString();
};

export const generateExpiryDate = (): string => {
  // Generate an expiry date at least 3 years in the future
  const currentDate = new Date();
  const expiryYear = currentDate.getFullYear() + 3;
  const expiryMonth = currentDate.getMonth() + 1; // JS months are 0-indexed
  
  // Format as MM/YY
  const month = expiryMonth.toString().padStart(2, '0');
  const year = (expiryYear % 100).toString().padStart(2, '0');
  
  return `${month}/${year}`;
};

export const createAccount = async (accountData: ICreateAccountDto): Promise<{
  account: IAccount,
  decryptedData: {
    phoneNumber: string,
    dateOfBirth: string,
    cardDetails: {
      cardNumber: string,
      cvv: string,
      expiryDate: string
    }
  }
}> => {
  try {
    const { firstName, surname, email, phoneNumber, dateOfBirth } = accountData;

    // Check if email already exists
    const existingEmailAccount = await Account.findOne({ email });
    if (existingEmailAccount) {
      throw new Error('An account with this email already exists');
    }
    
    // Check if phone number already exists
    // Since phone numbers are encrypted, we need to check differently
    const allAccounts = await Account.find({});
    for (const account of allAccounts) {
      try {
        const decryptedPhone = decrypt(
          JSON.parse(account.phoneNumber as string).encryptedData,
          JSON.parse(account.phoneNumber as string).iv,
          JSON.parse(account.phoneNumber as string).authTag
        );
        
        if (decryptedPhone === phoneNumber) {
          throw new Error('An account with this phone number already exists');
        }
      } catch (error) {
        // If we can't decrypt a specific record, continue checking others
        logger.warn(`Could not decrypt phone number for account: ${account._id}`, error);
        continue;
      }
    }

    // Generate account number and card details
    const accountNumber = generateAccountNumber();
    const cardNumber = generateCardNumber();
    const cvv = generateCVV();
    const expiryDate = generateExpiryDate();

    // Encrypt sensitive data
    const encryptedPhoneNumber = encrypt(phoneNumber);
    const encryptedDOB = encrypt(dateOfBirth);
    const encryptedCardNumber = encrypt(cardNumber);
    const encryptedCVV = encrypt(cvv);
    const encryptedExpiryDate = encrypt(expiryDate);

    // Create new account
    const newAccount = new Account({
      firstName,
      surname,
      email,
      phoneNumber: JSON.stringify(encryptedPhoneNumber),
      dateOfBirth: JSON.stringify(encryptedDOB),
      accountNumber,
      cardDetails: {
        cardNumber: JSON.stringify(encryptedCardNumber),
        cvv: JSON.stringify(encryptedCVV),
        expiryDate: JSON.stringify(encryptedExpiryDate),
      },
    });

    await newAccount.save();
    logger.info(`Account created successfully for ${email}`);

    return {
      account: newAccount,
      decryptedData: {
        phoneNumber,
        dateOfBirth,
        cardDetails: {
          cardNumber,
          cvv,
          expiryDate,
        }
      }
    };
  } catch (error) {
    logger.error('Error creating account:', error);
    throw error;
  }
};

export const getAccountByNumber = async (accountNumber: string): Promise<{
  account: IAccount,
  decryptedData: {
    phoneNumber: string,
    dateOfBirth: string,
    cardDetails: {
      cardNumber: string,
      cvv: string,
      expiryDate: string
    }
  }
}> => {
  try {
    const account = await Account.findOne({ accountNumber });
    if (!account) {
      throw new Error('Account not found');
    }
    
    // Decrypt sensitive data
    const phoneNumber = decrypt(
      JSON.parse(account.phoneNumber as string).encryptedData, 
      JSON.parse(account.phoneNumber as string).iv,
      JSON.parse(account.phoneNumber as string).authTag
    );
    
    const dateOfBirth = decrypt(
      JSON.parse(account.dateOfBirth as string).encryptedData, 
      JSON.parse(account.dateOfBirth as string).iv,
      JSON.parse(account.dateOfBirth as string).authTag
    );
    
    const cardNumber = decrypt(
      JSON.parse(account.cardDetails.cardNumber as string).encryptedData, 
      JSON.parse(account.cardDetails.cardNumber as string).iv,
      JSON.parse(account.cardDetails.cardNumber as string).authTag
    );
    
    const cvv = decrypt(
      JSON.parse(account.cardDetails.cvv as string).encryptedData, 
      JSON.parse(account.cardDetails.cvv as string).iv,
      JSON.parse(account.cardDetails.cvv as string).authTag
    );
    
    const expiryDate = decrypt(
      JSON.parse(account.cardDetails.expiryDate as string).encryptedData, 
      JSON.parse(account.cardDetails.expiryDate as string).iv,
      JSON.parse(account.cardDetails.expiryDate as string).authTag
    );
    
    return {
      account,
      decryptedData: {
        phoneNumber,
        dateOfBirth,
        cardDetails: {
          cardNumber,
          cvv,
          expiryDate,
        }
      }
    };
  } catch (error) {
    logger.error('Error fetching account:', error);
    throw error;
  }
};

export const getAllAccounts = async (): Promise<IAccountListResponse[]> => {
  try {
    const accounts = await Account.find({});
    
    const accountListResponses: IAccountListResponse[] = [];
    
    for (const account of accounts) {
      try {
        // Parse encrypted data
        const encryptedPhoneNumber = JSON.parse(account.phoneNumber as string);
        const encryptedDOB = JSON.parse(account.dateOfBirth as string);
        const encryptedCardNumber = JSON.parse(account.cardDetails.cardNumber as string);
        const encryptedCVV = JSON.parse(account.cardDetails.cvv as string);
        const encryptedExpiryDate = JSON.parse(account.cardDetails.expiryDate as string);
        
        // Decrypt data
        const phoneNumber = decrypt(encryptedPhoneNumber.encryptedData, encryptedPhoneNumber.iv, encryptedPhoneNumber.authTag);
        const dateOfBirth = decrypt(encryptedDOB.encryptedData, encryptedDOB.iv, encryptedDOB.authTag);
        const cardNumber = decrypt(encryptedCardNumber.encryptedData, encryptedCardNumber.iv, encryptedCardNumber.authTag);
        const cvv = decrypt(encryptedCVV.encryptedData, encryptedCVV.iv, encryptedCVV.authTag);
        const expiryDate = decrypt(encryptedExpiryDate.encryptedData, encryptedExpiryDate.iv, encryptedExpiryDate.authTag);
        
        accountListResponses.push({
          fullName: `${account.firstName} ${account.surname}`,
          accountNumber: account.accountNumber,
          encrypted: {
            phoneNumber: encryptedPhoneNumber,
            dateOfBirth: encryptedDOB,
            cardDetails: {
              cardNumber: encryptedCardNumber,
              cvv: encryptedCVV,
              expiryDate: encryptedExpiryDate,
            },
          },
          decrypted: {
            phoneNumber,
            dateOfBirth,
            cardDetails: {
              cardNumber,
              cvv,
              expiryDate,
            }
          }
        });
      } catch (error) {
        logger.error(`Error processing account ${account._id}:`, error);
        // Continue with next account
      }
    }
    
    return accountListResponses;
  } catch (error) {
    logger.error('Error fetching all accounts:', error);
    throw error;
  }
};

export const decryptEncryptedData = (encryptedData: IEncryptedData): string => {
  try {
    return decryptData(encryptedData);
  } catch (error) {
    logger.error('Error decrypting data:', error);
    throw error;
  }
};

export const formatAccountResponse = (
  account: IAccount,
  decryptedData: {
    phoneNumber: string,
    dateOfBirth: string,
    cardDetails: {
      cardNumber: string,
      cvv: string,
      expiryDate: string
    }
  }
): IAccountResponse => {
  return {
    firstName: account.firstName,
    surname: account.surname,
    email: account.email,
    accountNumber: account.accountNumber,
    encrypted: {
      phoneNumber: JSON.parse(account.phoneNumber as string),
      dateOfBirth: JSON.parse(account.dateOfBirth as string),
      cardDetails: {
        cardNumber: JSON.parse(account.cardDetails.cardNumber as string),
        cvv: JSON.parse(account.cardDetails.cvv as string),
        expiryDate: JSON.parse(account.cardDetails.expiryDate as string),
      },
    },
    decrypted: decryptedData
  };
};
