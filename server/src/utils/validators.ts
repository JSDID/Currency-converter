// Валідатори для валют та сум

// Перевіряємо чи є код валюти валідним (3 літери)
export const isValidCurrencyCode = (code: string): boolean => {
  return typeof code === 'string' && /^[A-Z]{3}$/.test(code.toUpperCase());
};

// Перевіряємо чи є сума валідною
export const isValidAmount = (amount: any): boolean => {
  return typeof amount === 'number' && 
         !isNaN(amount) && 
         isFinite(amount) && 
         amount > 0 && 
         amount <= 1000000000; // Максимум 1 мільярд
};

// Валідація запиту на конвертацію
export const validateConversionRequest = (body: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!body.from) {
    errors.push('Поле "from" є обов\'язковим');
  } else if (!isValidCurrencyCode(body.from)) {
    errors.push('Поле "from" повинно містити 3-літерний код валюти');
  }
  
  if (!body.to) {
    errors.push('Поле "to" є обов\'язковим');
  } else if (!isValidCurrencyCode(body.to)) {
    errors.push('Поле "to" повинно містити 3-літерний код валюти');
  }
  
  if (body.amount === undefined || body.amount === null) {
    errors.push('Поле "amount" є обов\'язковим');
  } else if (!isValidAmount(body.amount)) {
    errors.push('Сума повинна бути додатним числом не більше 1 мільярда');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};