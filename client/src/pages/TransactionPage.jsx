import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import Swal from 'sweetalert2';

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    amount: '',
    type: 'expense',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  
  // Edit functionality states
  const [isEditing, setIsEditing] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');

      const [catRes, transRes] = await Promise.all([
        axios.get('/categories', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/transactions', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setCategories(catRes.data.categories || []);
      setTransactions(transRes.data.transactions || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
      setCategories([]);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.date) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('token');
      
      // Map frontend form fields to backend expected fields
      const transactionData = {
        amount: form.amount,
        type: form.type,
        categoryId: form.category,
        date: form.date,
        notes: form.description
      };

      await axios.post('/transactions', transactionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Transaction added successfully!');
      fetchData();
      setForm({
        amount: '',
        type: 'expense',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
    } finally {
      setSubmitting(false);
    }
  };

  // Edit transaction function
  const handleEdit = (transaction) => {
    setIsEditing(true);
    setEditingTransaction(transaction);
    setForm({
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      description: transaction.notes || '',
      date: transaction.date.split('T')[0], // Format date for input
    });
    setError('');
    setSuccess('');
  };

  // Update transaction function
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.date) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('token');
      
      const transactionData = {
        amount: form.amount,
        type: form.type,
        categoryId: form.category,
        date: form.date,
        notes: form.description
      };

      await axios.put(`/transactions/${editingTransaction._id}`, transactionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Transaction updated successfully!');
      fetchData();
      setIsEditing(false);
      setEditingTransaction(null);
      setForm({
        amount: '',
        type: 'expense',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update transaction');
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel edit function
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingTransaction(null);
    setForm({
      amount: '',
      type: 'expense',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setError('');
  };

  // Delete transaction function with SweetAlert confirmation
  const handleDelete = async (transactionId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this transaction!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        customClass: {
          popup: 'rounded-lg',
        }
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        
        await axios.delete(`/transactions/${transactionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        await Swal.fire({
          title: 'Deleted!',
          text: 'Your transaction has been deleted.',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-lg',
          }
        });

        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete transaction');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount) || 0);
  };

  const filteredTransactions = transactions
    .filter(tx => filterType === 'all' || tx.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'amount') return parseFloat(b.amount) - parseFloat(a.amount);
      return 0;
    });

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + transactionsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Transaction Management
          </h1>
          <p className="text-gray-600">Track your income and expenses efficiently.</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add/Edit Transaction Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {isEditing ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="space-y-4">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name} ({cat.type})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="Enter description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Transaction' : 'Add Transaction')}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={submitting}
                      className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Transactions List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-blue-600 text-white p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 md:space-x-4">
                <h3 className="text-xl font-bold">Recent Transactions</h3>
                <div className="flex space-x-2">
                  <select
                    value={filterType}
                    onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-1 rounded-lg bg-white text-gray-800 border border-gray-200 text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="income">Income Only</option>
                    <option value="expense">Expense Only</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 rounded-lg bg-white text-gray-800 border border-gray-200 text-sm"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="amount">Sort by Amount</option>
                  </select>
                </div>
              </div>

              {paginatedTransactions.length === 0 ? (
                <div className="p-12 text-center text-gray-600">
                  <h4 className="text-lg font-medium">
                    {transactions.length === 0 ? 'No transactions yet' : 'No transactions match your filter'}
                  </h4>
                  <p className="mt-2">
                    {transactions.length === 0 ? 'Start by adding your first transaction.' : 'Adjust your filters to see results.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {paginatedTransactions.map((tx) => {
                    const category = categories.find(cat => cat._id === tx.category);
                    return (
                      <div key={tx._id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                              style={{ backgroundColor: category?.color || '#6B7280' }}
                            >
                              {category?.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{tx.description || 'No description'}</h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>{category?.name || 'Unknown Category'}</span>
                                <span>•</span>
                                <span>{new Date(tx.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex items-center space-x-4">
                            <div>
                              <p className={`text-lg font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                              </p>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${tx.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {tx.type}
                              </span>
                            </div>
                            {/* Edit and Delete Buttons */}
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(tx)}
                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(tx._id)}
                                className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {startIndex + 1}-{Math.min(startIndex + transactionsPerPage, filteredTransactions.length)} of {filteredTransactions.length}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
