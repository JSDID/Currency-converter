// Константи для роботи з API НБУ
export const NBU_API_URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

// Час кешування (24 години в секундах)
export const CACHE_DURATION = 24 * 60 * 60; // 86400 секунд

// Порт сервера
export const PORT = process.env.PORT || 3001;

// Популярні валюти для швидкого доступу
export const POPULAR_CURRENCIES = ['USD', 'EUR', 'GBP', 'PLN', 'CAD'] as const;

// Код української гривні (базова валюта НБУ)
export const UAH_CODE = 'UAH';