import { Request, Response } from 'express';
import { CurrencyService } from '../services/currencyService.js';
import { ConversionRequest } from '../types/currency.types.js';

export class CurrencyController {
  // GET /api/rates - отримуємо всі курси валют
  static async getAllRates(req: Request, res: Response) {
    try {
      const rates = await CurrencyService.getAllRates();
      
      res.json({
        success: true,
        data: rates,
        message: 'Курси валют успішно отримано'
      });
    } catch (error) {
      console.error('❌ Помилка в getAllRates:', error);
      res.status(500).json({
        success: false,
        error: 'Не вдалося отримати курси валют',
        message: error instanceof Error ? error.message : 'Невідома помилка'
      });
    }
  }

  // GET /api/rates/:from/:to - отримуємо курс конкретної валютної пари
  static async getExchangeRate(req: Request, res: Response) {
    try {
      const { from, to } = req.params;

      if (!from || !to) {
        return res.status(400).json({
          success: false,
          error: 'Потрібно вказати обидві валюти (from та to)'
        });
      }

      const rate = await CurrencyService.getExchangeRate(from, to);
      
      res.json({
        success: true,
        data: {
          from: from.toUpperCase(),
          to: to.toUpperCase(),
          rate: rate,
          timestamp: new Date().toISOString()
        },
        message: `Курс ${from.toUpperCase()}/${to.toUpperCase()} успішно отримано`
      });
    } catch (error) {
      console.error('❌ Помилка в getExchangeRate:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Помилка при отриманні курсу',
        message: 'Перевірте правильність кодів валют'
      });
    }
  }

  // POST /api/convert - конвертуємо суму
  static async convertCurrency(req: Request, res: Response) {
    try {
      const { from, to, amount }: ConversionRequest = req.body;

      // Валідація вхідних даних
      if (!from || !to || amount === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Потрібно вказати: from, to, amount'
        });
      }

      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Сума повинна бути додатним числом'
        });
      }

      const conversion = await CurrencyService.convertCurrency({ from, to, amount });
      
      res.json({
        success: true,
        data: conversion,
        message: `${amount} ${from.toUpperCase()} = ${conversion.result} ${to.toUpperCase()}`
      });
    } catch (error) {
      console.error('❌ Помилка в convertCurrency:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Помилка при конвертації',
        message: 'Перевірте правильність даних'
      });
    }
  }

  // GET /api/currencies - отримуємо список доступних валют
  static async getAvailableCurrencies(req: Request, res: Response) {
    try {
      const currencies = await CurrencyService.getAvailableCurrencies();
      
      res.json({
        success: true,
        data: {
          currencies: currencies,
          count: currencies.length
        },
        message: 'Список валют успішно отримано'
      });
    } catch (error) {
      console.error('❌ Помилка в getAvailableCurrencies:', error);
      res.status(500).json({
        success: false,
        error: 'Не вдалося отримати список валют',
        message: error instanceof Error ? error.message : 'Невідома помилка'
      });
    }
  }
}