import NodeCache from 'node-cache';
import { CACHE_DURATION } from './constants.js';

// Створюємо інстанс кешу з налаштуваннями
export const cache = new NodeCache({
  stdTTL: CACHE_DURATION,        // Час життя кешу (24 години)
  checkperiod: 600,              // Перевірка застарілих записів кожні 10 хвилин
  useClones: false,              // Не клонувати об'єкти для швидкості
  deleteOnExpire: true,          // Видаляти застарілі записи автоматично
});

// Ключі для кешування
export const CACHE_KEYS = {
  ALL_RATES: 'all_rates',
  LAST_UPDATE: 'last_update'
} as const;