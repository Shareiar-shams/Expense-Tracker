import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../services/api';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedMonthKey, setSelectedMonthKey] = useState(null); // View Details selected month
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination & Filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState('all'); // dropdown filter

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = Array.isArray(res.data.transactions) ? res.data.transactions : [];
        setTransactions(data);

        // Calculate summary
        const income = data.filter(t => t.type === 'income')
                           .reduce((sum, t) => sum + Number(t.amount || 0), 0);
        const expense = data.filter(t => t.type === 'expense')
                            .reduce((sum, t) => sum + Number(t.amount || 0), 0);
        setSummary({ income, expense, balance: income - expense });

        // Monthly aggregation
        const monthlyMap = new Map();
        data.forEach(tx => {
          const date = new Date(tx.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

          if (!monthlyMap.has(monthKey)) {
            monthlyMap.set(monthKey, { month: monthName, monthKey, income: 0, expense: 0, balance: 0, transactions: [] });
          }

          const monthData = monthlyMap.get(monthKey);
          monthData.transactions.push(tx);
          if (tx.type === 'income') monthData.income += Number(tx.amount || 0);
          else monthData.expense += Number(tx.amount || 0);
          monthData.balance = monthData.income - monthData.expense;
        });

        const sortedMonthlyData = Array.from(monthlyMap.values())
          .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
        setMonthlyData(sortedMonthlyData);

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Currency formatter
  const formatCurrency = amount =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  // Filter transactions based on dropdown or View Details
  const filteredTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    const txMonthKey = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
    if (selectedMonthKey) return txMonthKey === selectedMonthKey; // View Details
    if (selectedMonthFilter !== 'all') return txMonthKey === selectedMonthFilter; // dropdown
    return true;
  });

  // Pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  // Reset page when filter changes
  useEffect(() => setCurrentPage(1), [selectedMonthKey, selectedMonthFilter]);

  // Loading & Error UI
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-14 w-14 border-b-2 border-gray-600"></div></div>;
  if (error && transactions.length === 0) return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
        <div className="text-red-500 text-5xl mb-3">⚠</div>
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Try Again</button>
      </div>
    </div>
  );
  if (!error && transactions.length === 0) return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-white p-10 rounded-xl shadow-md text-center max-w-md">
        <div className="text-6xl mb-4">📄</div>
        <h2 className="text-2xl font-bold mb-3">No Transactions</h2>
        <p className="text-gray-600 mb-6">Start by adding your first record.</p>
        <Link to="/transactions" className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Add Transaction</Link>
      </div>
    </div>
  );

  // Chart Data (same as original)
  const chartData = {
    labels: ['Income', 'Expense'],
    datasets: [{ label: 'Amount', data: [summary.income, summary.expense], backgroundColor: ['#5cb85c', '#d9534f'], borderColor: ['#4cae4c', '#c9302c'], borderWidth: 2, borderRadius: 6 }]
  };
  const doughnutData = { labels: ['Income', 'Expense', 'Balance'], datasets: [{ data: [summary.income, summary.expense, Math.max(0, summary.balance)], backgroundColor: ['#5cb85c', '#d9534f', '#5bc0de'], borderColor: ['#4cae4c', '#c9302c', '#46b8da'], borderWidth: 2 }] };
  // const monthlyChartData = {
  //   labels: monthlyData.map(m => m.month),
  //   datasets: [
  //     { label: 'Income', data: monthlyData.map(m => m.income), borderColor: '#5cb85c', backgroundColor: 'rgba(92, 184, 92, 0.1)', fill: true, tension: 0.4, pointRadius: 6, pointHoverRadius: 8 },
  //     { label: 'Expense', data: monthlyData.map(m => m.expense), borderColor: '#d9534f', backgroundColor: 'rgba(217, 83, 79, 0.1)', fill: true, tension: 0.4, pointRadius: 6, pointHoverRadius: 8 }
  //   ]
  // };

  const availableMonths = monthlyData.map(m => ({ key: m.monthKey, name: m.month }));

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Overview of your financial activity.</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <h3 className="text-sm text-gray-600">Total Income</h3>
            <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(summary.income)}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <h3 className="text-sm text-gray-600">Total Expense</h3>
            <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(summary.expense)}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <h3 className="text-sm text-gray-600">Net Balance</h3>
            <p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(summary.balance)}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Income vs Expense</h3>
            <div className="h-72"><Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribution</h3>
            <div className="h-72"><Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
          </div>
        </div>

        {/* Monthly Trends Chart */}
        {/* {monthlyData.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Income & Expense Trends</h2>
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Financial Trends</h3>
              <div className="h-80"><Line data={monthlyChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
            </div>
          </div>
        )} */}

        {monthlyData.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Income & Expense Trends</h2>
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Financial Trends</h3>
              <div className="h-80">
                <Bar
                  data={{
                    labels: monthlyData.map(month => month.month),
                    datasets: [
                      {
                        label: 'Income',
                        data: monthlyData.map(month => month.income),
                        backgroundColor: '#5cb85c'
                      },
                      {
                        label: 'Expense',
                        data: monthlyData.map(month => month.expense),
                        backgroundColor: '#d9534f'
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return context.dataset.label + ': ' + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                          }
                        }
                      }
                    },
                    scales: {
                      x: { stacked: false },
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Monthly Breakdown */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monthlyData.slice().reverse().map(month => (
              <div key={month.monthKey} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all border">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{month.month}</h3>
                  <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">{month.transactions.length} Txns</span>
                </div>
                <div className="flex justify-center my-4">
                  <div className="w-28 h-28 rounded-full border-4 flex items-center justify-center" style={{ borderColor: month.balance >= 0 ? '#3b82f6' : '#f97316' }}>
                    <p className={`font-bold text-lg ${month.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>{formatCurrency(month.balance)}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Income:</span><span className="font-semibold text-green-600">{formatCurrency(month.income)}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Expense:</span><span className="font-semibold text-red-600">{formatCurrency(month.expense)}</span></div>
                </div>
                <div className="mt-4 text-right">
                  <button onClick={() => setSelectedMonthKey(month.monthKey)} className="text-sm text-blue-600 hover:underline">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-10">
          <div className="bg-gray-800 text-white p-5 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Filter:</label>
              <select value={selectedMonthFilter} onChange={e => setSelectedMonthFilter(e.target.value)} className="px-3 py-1 bg-white text-gray-800 rounded-lg border border-gray-300 text-sm">
                <option value="all">All Months</option>
                {availableMonths.map(m => <option key={m.key} value={m.key}>{m.name}</option>)}
              </select>
            </div>
          </div>

          {selectedMonthKey && (
            <div className="px-5 py-3 bg-gray-50 border-b">
              <button onClick={() => setSelectedMonthKey(null)} className="text-blue-600 hover:underline text-sm">← Back to All Transactions</button>
            </div>
          )}

          <div className="divide-y">
            {currentTransactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No transactions found.</div>
            ) : (
              currentTransactions.map(tx => (
                <div key={tx._id} className="p-5 hover:bg-gray-50 flex justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{tx.description || 'No description'}</h4>
                    <p className="text-gray-500 text-sm">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                  <div className={`text-lg font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-4 bg-gray-50 border-t flex justify-between items-center">
              <div className="text-sm text-gray-700">Page {currentPage} of {totalPages}</div>
              <div className="flex space-x-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50">Previous</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  return (
                    <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                      {pageNum}
                    </button>
                  );
                })}
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
