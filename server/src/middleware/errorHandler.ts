import { Request, Response, NextFunction } from 'express';

// Глобальний обробник помилок
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('🚨 Глобальна помилка:', error);

  // Якщо заголовки вже відправлені, передаємо помилку далі
  if (res.headersSent) {
    return next(error);
  }

  // Повертаємо стандартну помилку
  res.status(500).json({
    success: false,
    error: 'Внутрішня помилка сервера',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Щось пішло не так',
    timestamp: new Date().toISOString()
  });
};

// Обробник для неіснуючих маршрутів
export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Маршрут не знайдено',
    message: `Маршрут ${req.method} ${req.path} не існує`,
    timestamp: new Date().toISOString()
  });
};