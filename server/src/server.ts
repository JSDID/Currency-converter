import express from 'express';
import cors from 'cors';
import { PORT } from './config/constants.js';
import currencyRoutes from './routes/currencyRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { Logger } from './utils/logger.js';

const createHTTPServer = () => {
  const app = express();

  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ origin: true, credentials: true }));

  // Логування
  app.use((req, res, next) => {
    Logger.info(`${req.method} ${req.path}`);
    next();
  });

  // Маршруты
  app.get('/ping', (req, res) => {
    res.json({ success: true, message: 'Pong!', timestamp: new Date().toISOString() });
  });
  
  app.use('/api', currencyRoutes);

  // Обработка ошибок
  app.use(notFound);
  app.use(errorHandler);

  return app;
};

// Только экспорт, БЕЗ запуска
export const app = createHTTPServer();