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
    <div>
      <h2>Currency Converter</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          required
        />

        <label htmlFor="fromCurrency">From Currency:</label>
        <input
          type="text"
          id="fromCurrency"
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value.toUpperCase())}
          required
        />

        <label htmlFor="toCurrency">To Currency:</label>
        <input
          type="text"
          id="toCurrency"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value.toUpperCase())}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Converting..." : "Convert"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result !== null && (
        <p>
          {amount} {fromCurrency} = {result} {toCurrency}
        </p>
      )}
    </div>
  );
};

export default CurrencyConverter;