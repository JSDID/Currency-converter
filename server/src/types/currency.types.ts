// Типи для роботи з валютами

// Відповідь від API НБУ
export interface NBUCurrencyRate {
  r030: number;           // Цифровий код валюти
  txt: string;            // Назва валюти
  rate: number;           // Курс до гривні
  cc: string;             // Літерний код валюти (USD, EUR тощо)
  exchangedate: string;   // Дата курсу
}

// Наша модель валюти
export interface Currency {
  code: string;           // Код валюти (USD, EUR)
  name: string;           // Назва валюти
  rate: number;           // Курс до UAH
  date: string;           // Дата оновлення
}

// Запит на конвертацію
export interface ConversionRequest {
  from: string;           // З якої валюти
  to: string;             // В яку валюту
  amount: number;         // Сума для конвертації
}

// Результат конвертації
export interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  date: string;
}

// Відповідь з курсами
export interface RatesResponse {
  rates: Currency[];
  lastUpdated: string;
  source: 'cache' | 'api';
}