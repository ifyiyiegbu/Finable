import { Document } from 'mongoose';

export interface IEncryptedData {
  encryptedData: string;
  iv: string;
  authTag: string;
}

export interface ICardDetails {
  cardNumber: string | IEncryptedData;
  cvv: string | IEncryptedData;
  expiryDate: string | IEncryptedData;
}

export interface IAccount {
  firstName: string;
  surname: string;
  email: string;
  phoneNumber: string | IEncryptedData;
  dateOfBirth: string | IEncryptedData;
  accountNumber: string;
  cardDetails: ICardDetails;
  createdAt: Date;
}

export interface IAccountDocument extends IAccount, Document {}

export interface ICreateAccountDto {
  firstName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export interface IEncryptedFields {
  phoneNumber: IEncryptedData;
  dateOfBirth: IEncryptedData;
  cardNumber: IEncryptedData;
  cvv: IEncryptedData;
  expiryDate: IEncryptedData;
}

export interface IAccountResponse {
  firstName: string;
  surname: string;
  email: string;
  accountNumber: string;
  encrypted: {
    phoneNumber: IEncryptedData;
    dateOfBirth: IEncryptedData;
    cardDetails: {
      cardNumber: IEncryptedData;
      cvv: IEncryptedData;
      expiryDate: IEncryptedData;
    };
  };
  decrypted: {
    phoneNumber: string;
    dateOfBirth: string;
    cardDetails: {
      cardNumber: string;
      cvv: string;
      expiryDate: string;
    };
  };
}

export interface IAccountListResponse {
  fullName: string;
  accountNumber: string;
  encrypted: {
    phoneNumber: IEncryptedData;
    dateOfBirth: IEncryptedData;
    cardDetails: {
      cardNumber: IEncryptedData;
      cvv: IEncryptedData;
      expiryDate: IEncryptedData;
    };
  };
  decrypted: {
    phoneNumber: string;
    dateOfBirth: string;
    cardDetails: {
      cardNumber: string;
      cvv: string;
      expiryDate: string;
    };
  };
}