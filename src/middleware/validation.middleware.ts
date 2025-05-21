import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import logger from '../utils/logger';

export const validateCreateAccount = (): ValidationChain[] => [
  body('firstName')
    .isString()
    .notEmpty()
    .withMessage('First name is required'),
  body('surname')
    .isString()
    .notEmpty()
    .withMessage('Surname is required'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('phoneNumber')
    .isMobilePhone('any')
    .withMessage('Valid phone number is required'),
  body('dateOfBirth')
    .isDate()
    .withMessage('Valid date of birth is required (YYYY-MM-DD)'),
];

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation errors:', errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};