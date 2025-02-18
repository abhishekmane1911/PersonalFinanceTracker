import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertCurrency } from "../api";

// Currency list with names and flags
const currencies = [
  { code: "USD", name: "United States Dollar", flag: "🇺🇸" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷" },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪" },
  { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴" },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽" },
  { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
  { code: "RUB", name: "Russian Ruble", flag: "🇷🇺" },
];

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("INR");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const data = await convertCurrency(amount, fromCurrency, toCurrency);
      if (data.converted_amount) {
        setResult(data.converted_amount);
      } else {
        setError("Conversion failed");
      }
    } catch (err: any) {
      setError(err.message || "Conversion error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
          Currency Converter
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount:
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              required
              className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* From Currency Dropdown */}
          <div>
            <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700">
              From Currency:
            </label>
            <select
              id="fromCurrency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          {/* To Currency Dropdown */}
          <div>
            <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700">
              To Currency:
            </label>
            <select
              id="toCurrency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          {/* Convert Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {loading ? "Converting..." : "Convert"}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

        {/* Conversion Result */}
        {result !== null && (
          <p className="mt-4 text-center text-lg text-gray-800">
            {amount} {fromCurrency} = {result} {toCurrency}
          </p>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;