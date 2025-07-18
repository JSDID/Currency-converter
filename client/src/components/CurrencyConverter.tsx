import React, { useState, useEffect, useCallback, memo } from "react"

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

// Винесена функція для назв валют
const getCurrencyName = (code: string): string => {
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
}

// Винесені стилі
const styles = {
  container: {
    maxWidth: 400,
    margin: "2rem auto",
    padding: 24,
    borderRadius: 16,
    boxShadow: "0 2px 8px #ddd",
    backgroundColor: "#fff"
  } as React.CSSProperties,
  label: {
    display: "block",
    marginBottom: 8,
    color: "#555"
  },
  input: {
    width: "100%",
    fontSize: 18,
    padding: 12,
    border: "1px solid #ddd",
    borderRadius: 8,
    boxSizing: "border-box" as const
  },
  select: {
    width: "100%",
    padding: 12,
    border: "1px solid #ddd",
    borderRadius: 8
  },
  button: {
    width: "100%",
    padding: 16,
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer" as const,
    marginBottom: 16
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed" as const
  },
  result: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    border: "1px solid #e9ecef"
  },
  error: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #f5c6cb",
    marginTop: 16
  }
}

// Підкомпонент для селектора валюти
interface CurrencySelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  currencies: Currency[]
}
const CurrencySelect: React.FC<CurrencySelectProps> = memo(({ label, value, onChange, currencies }) => (
  <div style={{ flex: 1 }}>
    <label style={styles.label}>{label}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={styles.select}
    >
      {currencies.map((c) => (
        <option key={c.code} value={c.code}>
          {c.code} - {c.name}
        </option>
      ))}
    </select>
  </div>
))

const CurrencyConverter: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [from, setFrom] = useState<string>("USD")
  const [to, setTo] = useState<string>("UAH")
  const [amount, setAmount] = useState<number>(1)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  // Обертаємо fetchCurrencies в useCallback
  const fetchCurrencies = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/currencies`)
      const data = await response.json()
      if (data.success) {
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
  }, [])

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
        headers: { 'Content-Type': 'application/json' },
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
    <div style={styles.container}>
      <h2 style={{ color: "#333", marginBottom: 24 }}>Конвертер валют (НБУ)</h2>
      {/* Поле суми */}
      <div style={{ marginBottom: 16 }}>
        <label style={styles.label}>Сума:</label>
        <input
          type="number"
          value={amount}
          min={0}
          step="any"
          onChange={e => setAmount(Number(e.target.value))}
          style={styles.input}
        />
      </div>
      {/* Селекти валют */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <CurrencySelect
          label="З валюти:"
          value={from}
          onChange={setFrom}
          currencies={currencies}
        />
        <span style={{ fontSize: 24, marginTop: 24 }}>→</span>
        <CurrencySelect
          label="В валюту:"
          value={to}
          onChange={setTo}
          currencies={currencies}
        />
      </div>
      {/* Кнопка конвертації */}
      <button
        onClick={handleConvert}
        disabled={loading || currencies.length === 0}
        style={{
          ...styles.button,
          ...(loading || currencies.length === 0 ? styles.buttonDisabled : {})
        }}
      >
        {loading ? "Конвертування..." : "Конвертувати"}
      </button>
      {/* Результат */}
      {result && (
        <div style={styles.result}>
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
        <div style={styles.error}>{error}</div>
      )}
    </div>
  )
}

export default CurrencyConverter