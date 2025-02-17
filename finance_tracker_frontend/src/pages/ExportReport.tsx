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
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Export Transactions</h2>
      
      <button 
        onClick={handleExport} 
        disabled={loading}
        className={`w-full sm:w-auto py-3 px-6 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all`}
      >
        {loading ? 'Exporting...' : 'Download CSV'}
      </button>
  
      {error && (
        <div className="mt-4 bg-red-100 text-red-800 p-4 rounded-md flex items-center justify-between w-full sm:w-auto">
          <span>⚠️ {error}</span>
          <button 
            onClick={() => setError('')} 
            className="text-red-600 font-semibold hover:text-red-800 focus:outline-none"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportReport;
