import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertCurrency } from "../api";

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
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
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

          <div>
            <label
              htmlFor="fromCurrency"
              className="block text-sm font-medium text-gray-700"
            >
              From Currency:
            </label>
            <input
              type="text"
              id="fromCurrency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value.toUpperCase())}
              required
              className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="toCurrency"
              className="block text-sm font-medium text-gray-700"
            >
              To Currency:
            </label>
            <input
              type="text"
              id="toCurrency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value.toUpperCase())}
              required
              className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

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

        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

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
