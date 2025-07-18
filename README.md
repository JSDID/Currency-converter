# Конвертер валют (НБУ)

## 🎯 Реалізовані функції

### ✅ Backend сервіс:
- Отримує курси валют з API НБУ
- API endpoint для конвертації (`/api/convert`)
- Конвертація між будь-якими валютами
- Кешування даних на 24 години
- 47 доступних валют

### ✅ React UI:
- Форма з селектами валют ✅
- Поле вводу суми ✅  
- Кнопка "Конвертувати" ✅
- Відображення результату конвертації ✅
- Валідація (додатні числа) ✅
- Завантаження всіх валют з бекенду ✅

### ✅ Кешування та оптимізація:
- Кеш на 24 години ✅
- Уникає зайвих викликів API ✅
- Швидка конвертація через кеш ✅

## 🏗️ Структура проекту

```
express-currency-converter/
├── client/                 # React фронтенд
├── server/                 # Node.js бекенд
└── README.md              # Документація
```

### Backend структура (`server/src/`)

```
server/src/
├── config/
│   ├── constants.ts       # Константи (URL API НБУ, час кешу, порт)
│   └── cache.ts          # Налаштування NodeCache для кешування
│
├── controllers/
│   └── currencyController.ts  # Обробники HTTP запитів (getAllRates, convert, тощо)
│
├── services/
│   ├── currencyService.ts     # Бізнес-логіка (конвертація, робота з кешем)
│   └── nbuApiService.ts      # Взаємодія з API НБУ
│
├── models/
│   └── Currency.ts           # TypeScript типи для валют
│
├── routes/
│   └── currencyRoutes.ts     # Маршрути API (/api/rates, /api/convert)
│
├── middleware/
│   ├── errorHandler.ts       # Глобальна обробка помилок
│   └── validation.ts         # Валідація вхідних даних
│
├── utils/
│   ├── logger.ts            # Логування запитів
│   └── validators.ts        # Валідатори для валют та сум
│
├── types/
│   └── currency.types.ts    # TypeScript інтерфейси
│
├── index.ts               # Точка входу (запуск сервера)
└── server.ts             # Налаштування Express додатку
```

### Frontend структура (`client/src/`)

```
client/src/
├── components/
│   └── CurrencyConverter.tsx  # Головний компонент конвертера
├── App.tsx                   # Головний компонент додатку
├── main.tsx                  # Точка входу React
├── App.css                   # Стилі додатку
└── index.css                 # Глобальні стилі
```

## 🚀 Запуск проекту

### Вимоги
- Node.js 18+
- npm або yarn

### Backend запуск

Перший термінал:
```bash
cd ваша_локальна_папка/express-currency-converter/server
npm install
npm run dev

Очікуваний результат:
> backend@1.0.0 dev
> vite dev

  VITE v6.3.5  ready in 789 ms

  ➜  Local:   http://localhost:8000/
  ➜  Network: http://192.168.1.4:8000/
  ```

### Frontend запуск

Другий термінал:
```bash
cd ваша_локальна_папка/express-currency-converter/client
npm install
npm run dev

Очікуваний результат:
> client@0.0.0 dev
> vite

  ➜  Local:   http://localhost:5173/
  ```

### Доступ до додатку

- **Фронтенд:** http://localhost:5173
- **Backend API:** http://localhost:8000/api
- **Health Check:** http://localhost:8000/ping

## 🔧 API Endpoints

| Метод | Шлях                    | Опис                         |
|-------|-------------------------|------------------------------|
| GET   | /api/rates              | Отримати всі курси валют     |
| GET   | /api/rates/:from/:to    | Отримати курс валютної пари  |
| POST  | /api/convert            | Конвертувати суму            |
| GET   | /api/currencies         | Список доступних валют       |
| GET   | /ping                   | Health check                 |


## 📋 Приклад конвертації
```bash
curl -X POST http://localhost:8000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"from":"USD","to":"UAH","amount":100}'
```

**Відповідь:**

```json
{
  "success": true,
  "data": {
    "from": "USD",
    "to": "UAH", 
    "amount": 100,
    "result": 4181.16,
    "rate": 41.8116,
    "date": "2025-07-02T13:20:24.033Z"
  },
  "message": "100 USD = 4181.16 UAH"
}
```

## 🛠️ Технології

**Backend:**
- Node.js + TypeScript
- Express.js — веб-сервер
- Vite — інструмент розробки
- node-cache — кешування
- cross-fetch — HTTP запити

**Frontend:**
- React 19 + TypeScript
- Vite — збірка та розробка
- Звичайний CSS — стилізація

## 📦 Особливості

- **Кешування:** Курси валют кешуються на 24 години
- **Валідація:** Перевірка коректності валютних кодів та сум
- **Обробка помилок:** Централізована обробка помилок
- **Логування:** Детальні логи запитів та операцій
- **TypeScript:** Повна типізація коду
- **Responsive:** Адаптивний дизайн

## 🌐 Джерело даних

Додаток використовує офіційне API Національного банку України:

- **URL:** https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json
- **Оновлення:** щоденно
- **Доступні валюти:** 47 (включаючи метали)

## 📝 Логування

Backend виводить детальні логи:

ℹ️  [INFO] GET /api/currencies

🌐 Отримуємо свіжі курси з API НБУ

🔄 Запит до API НБУ...

✅ Отримано 46 курсів валют від НБУ

💾 Курси збережено в кеш

📦 Повертаємо курси з кешу


