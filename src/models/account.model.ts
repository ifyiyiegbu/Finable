import mongoose, { Schema } from 'mongoose';
import { IAccount, IAccountDocument } from '../interfaces/account.interface';

const accountSchema = new Schema<IAccountDocument>({
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  cardDetails: {
    cardNumber: { type: String, required: true },
    cvv: { type: String, required: true },
    expiryDate: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const Account = mongoose.model<IAccountDocument>('Account', accountSchema);

export default Account;