import React, { useState, useEffect, useCallback } from "react"

interface Currency {
  code: string
  name: string
}

interface ConversionResult {
  from: string
  to: string
  amount: number
  result: number
  rate: number
  date: string
}

export const API_BASE_URL = "http://localhost:8000"

const CurrencyConverter: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [from, setFrom] = useState<string>("USD")
  const [to, setTo] = useState<string>("UAH")
  const [amount, setAmount] = useState<number>(1)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const getCurrencyName = useCallback((code: string): string => {
    const names: Record<string, string> = {
      USD: 'Долар США',
      EUR: 'Євро', 
      UAH: 'Українська гривня',
      GBP: 'Фунт стерлінгів',
      PLN: 'Злотий',
      CAD: 'Канадський долар',
      CHF: 'Швейцарський франк',
      JPY: 'Японська єна',
      AUD: 'Австралійський долар',
      CNY: 'Китайський юань'
    }
    return names[code] || code
  }, [])

  // Обертаємо fetchCurrencies в useCallback
  const fetchCurrencies = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/currencies`)
      const data = await response.json()
      
      if (data.success) {
        // Конвертуємо коди валют в об'єкти з назвами
        const currencyList = data.data.currencies.map((code: string) => ({
          code,
          name: getCurrencyName(code)
        }))
        setCurrencies(currencyList)
      }
    } catch (err) {
      console.error('Помилка завантаження валют:', err)
      setError('Не вдалося завантажити список валют')
    }
  }, [getCurrencyName]) // Додаємо getCurrencyName як залежність

  // Тепер useEffect не буде скаржитись
  useEffect(() => {
    fetchCurrencies()
  }, [fetchCurrencies])

  const handleConvert = async () => {
    if (amount <= 0) {
      setError('Сума повинна бути більше 0')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to, amount })
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.error || 'Помилка конвертації')
      }
    } catch (err) {
      console.error('Помилка конвертації:', err)
      setError('Не вдалося виконати конвертацію')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 2px 8px #ddd",
        backgroundColor: "#fff"
      }}
    >
      <h2 style={{ color: "#333", marginBottom: 24 }}>Конвертер валют (НБУ)</h2>
      
      {/* Поле суми */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, color: "#555" }}>
          Сума:
        </label>
        <input
          type="number"
          value={amount}
          min={0}
          step="any"
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{ 
            width: "100%", 
            fontSize: 18, 
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 8,
            boxSizing: "border-box"
          }}
        />
      </div>

      {/* Селекти валют */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: 8, color: "#555" }}>
            З валюти:
          </label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            style={{ 
              width: "100%", 
              padding: 12, 
              border: "1px solid #ddd",
              borderRadius: 8 
            }}
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>
        
        <span style={{ fontSize: 24, marginTop: 24 }}>→</span>
        
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: 8, color: "#555" }}>
            В валюту:
          </label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={{ 
              width: "100%", 
              padding: 12, 
              border: "1px solid #ddd",
              borderRadius: 8 
            }}
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Кнопка конвертації */}
      <button
        onClick={handleConvert}
        disabled={loading || currencies.length === 0}
        style={{
          width: "100%",
          padding: 16,
          fontSize: 16,
          fontWeight: "bold",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: 16
        }}
      >
        {loading ? "Конвертування..." : "Конвертувати"}
      </button>

      {/* Результат */}
      {result && (
        <div style={{
          backgroundColor: "#f8f9fa",
          padding: 16,
          borderRadius: 8,
          border: "1px solid #e9ecef"
        }}>
          <h3 style={{ margin: "0 0 8px 0", color: "#28a745" }}>
            {result.amount} {result.from} = {result.result} {result.to}
          </h3>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
            Курс: 1 {result.from} = {result.rate} {result.to}
          </p>
          <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: 12 }}>
            Оновлено: {new Date(result.date).toLocaleString('uk-UA')}
          </p>
        </div>
      )}

      {/* Помилки */}
      {error && (
        <div style={{
          backgroundColor: "#f8d7da",
          color: "#721c24",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #f5c6cb",
          marginTop: 16
        }}>
          {error}
        </div>
      )}
    </div>
  )
}

export default CurrencyConverter