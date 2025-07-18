import { Router } from 'express';
import { CurrencyController } from '../controllers/currencyController.js';
import { validateConversion, validateCurrencyCodes } from '../middleware/validation.js';

const router = Router();

// Обертаємо async функції для правильної обробки помилок
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Маршрути для роботи з валютами
router.get('/rates', asyncHandler(CurrencyController.getAllRates));
router.get('/rates/:from/:to', validateCurrencyCodes, asyncHandler(CurrencyController.getExchangeRate));
router.post('/convert', validateConversion, asyncHandler(CurrencyController.convertCurrency));
router.get('/currencies', asyncHandler(CurrencyController.getAvailableCurrencies));

export default router;