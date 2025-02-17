import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { exportTransactions } from "../api";

const ExportReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleExport = async () => {
    setLoading(true);
    setError('');

    try {
      const blob = await exportTransactions();
      
      // Verify CSV content
      const text = await blob.text();
      if (text.includes('No transactions')) {
        throw new Error('No transactions found for export');
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="export-container">
      <h2>Export Transactions</h2>
      <button 
        onClick={handleExport} 
        disabled={loading}
        className="export-button"
      >
        {loading ? 'Exporting...' : 'Download CSV'}
      </button>
      
      {error && (
        <div className="error-message">
          ⚠️ {error}
          <button onClick={() => setError('')} className="dismiss-button">
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportReport;
