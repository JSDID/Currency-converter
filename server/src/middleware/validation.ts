import { Request, Response, NextFunction } from 'express';
import { validateConversionRequest, isValidCurrencyCode } from '../utils/validators.js';

// Middleware для валідації запиту конвертації
export const validateConversion = (req: Request, res: Response, next: NextFunction): void => {
  const validation = validateConversionRequest(req.body);
  
  if (!validation.isValid) {
    res.status(400).json({
      success: false,
      error: 'Помилка валідації',
      message: 'Перевірте правильність вхідних даних',
      details: validation.errors
    });
    return;
  }
  
  next();
};

// Middleware для валідації кодів валют в параметрах URL
export const validateCurrencyCodes = (req: Request, res: Response, next: NextFunction): void => {
  const { from, to } = req.params;
  
  if (from && !isValidCurrencyCode(from)) {
    res.status(400).json({
      success: false,
      error: 'Некоректний код валюти "from"',
      message: 'Код валюти повинен містити рівно 3 літери'
    });
    return;
  }
  
  if (to && !isValidCurrencyCode(to)) {
    res.status(400).json({
      success: false,
      error: 'Некоректний код валюти "to"',
      message: 'Код валюти повинен містити рівно 3 літери'
    });
    return;
  }
  
  next();
};