import fetch from 'cross-fetch';
import { NBU_API_URL } from '../config/constants.js';
import { NBUCurrencyRate } from '../types/currency.types.js';

export class NbuApiService {
  // Отримуємо всі курси валют від НБУ
  static async fetchExchangeRates(): Promise<NBUCurrencyRate[]> {
    try {
      console.log('🔄 Запит до API НБУ...');
      
      const response = await fetch(NBU_API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP помилка! статус: ${response.status}`);
      }
      
      const data: NBUCurrencyRate[] = await response.json();
      
      console.log(`✅ Отримано ${data.length} курсів валют від НБУ`);
      
      return data;
    } catch (error) {
      console.error('❌ Помилка при отриманні курсів від НБУ:', error);
      throw new Error('Не вдалося отримати курси валют від НБУ');
    }
  }

  // Отримуємо курс конкретної валюти
  static async fetchCurrencyRate(currencyCode: string): Promise<NBUCurrencyRate | null> {
    try {
      const rates = await this.fetchExchangeRates();
      const rate = rates.find(r => r.cc === currencyCode.toUpperCase());
      
      return rate || null;
    } catch (error) {
      console.error(`❌ Помилка при отриманні курсу ${currencyCode}:`, error);
      throw error;
    }
  }
}