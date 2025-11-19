import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import Swal from 'sweetalert2';
import CategoryModal from "../components/CategoryModal";
import {
  FaHome, FaUtensils, FaCar, FaGamepad, FaMoneyBillAlt, FaGift,
  FaHospital, FaBook, FaShoppingCart, FaDonate
} from 'react-icons/fa';

const CATEGORY_ICONS = [
  { icon: FaHome, label: 'Home' },
  { icon: FaUtensils, label: 'Food' },
  { icon: FaCar, label: 'Transport' },
  { icon: FaGamepad, label: 'Entertainment' },
  { icon: FaMoneyBillAlt, label: 'Salary' },
  { icon: FaGift, label: 'Gift' },
  { icon: FaHospital, label: 'Health' },
  { icon: FaBook, label: 'Education' },
  { icon: FaShoppingCart, label: 'Shopping' },
  { icon: FaDonate, label: 'Donation' },
];

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
  
  // Category input states
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  
  // Category modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
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
      setCategoryInput('');

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
    const category = categories.find(cat => cat._id === transaction.category);
    setForm({
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      description: transaction.description || '',
      date: transaction.date.split('T')[0], // Format date for input
    });
    setCategoryInput(category?.name || '');
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
      setCategoryInput('');

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
    setCategoryInput('');
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

  // Category input handling
  useEffect(() => {
    if (categoryInput.length > 0) {
      const filtered = categories.filter(cat => 
        cat.name.toLowerCase().includes(categoryInput.toLowerCase())
      );
      setFilteredCategories(filtered);
      setShowCategoryDropdown(true);
    } else {
      setFilteredCategories(categories);
      setShowCategoryDropdown(false);
    }
  }, [categoryInput, categories]);

  const handleCategoryInputChange = (e) => {
    const value = e.target.value;
    setCategoryInput(value);
    setForm({ ...form, category: '' }); // Clear selected category when typing
  };

  const handleCategorySelect = (category) => {
    setForm({ ...form, category: category._id });
    setCategoryInput(category.name);
    setShowCategoryDropdown(false);
  };

  const handleCategoryInputFocus = () => {
    setFilteredCategories(categories);
    setShowCategoryDropdown(true);
  };

  const handleCreateCategory = () => {
    if (!categoryInput.trim()) {
      setError('Please enter a category name');
      return;
    }
    setShowCategoryModal(true);
  };

  const handleCategoryModalSave = async (categoryData) => {
    try {
      const token = localStorage.getItem('token');
      
      const newCategory = {
        name: categoryData.name,
        type: categoryData.type,
        color: categoryData.color,
        icon: categoryData.icon
      };

      const response = await axios.post('/categories', newCategory, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const createdCategory = response.data.category;
      
      // Update categories list
      setCategories(prev => [...prev, createdCategory]);
      
      // Select the newly created category
      setForm({ ...form, category: createdCategory._id });
      setCategoryInput(createdCategory.name);
      setShowCategoryDropdown(false);
      
      setSuccess(`Category "${createdCategory.name}" created and selected!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleCategoryModalClose = () => {
    setShowCategoryModal(false);
  };

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
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={categoryInput}
                      onChange={handleCategoryInputChange}
                      onFocus={handleCategoryInputFocus}
                      placeholder="Search or create category..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    
                    {/* Dropdown */}
                    {showCategoryDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {/* Show filtered categories */}
                        {filteredCategories.length > 0 && (
                          <div>
                            <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50">
                              Existing Categories
                            </div>
                            {filteredCategories.map((cat) => {
                              const IconComp = CATEGORY_ICONS.find(c => c.label === cat.icon)?.icon || FaDonate;
                              return (
                                <div
                                  key={cat._id}
                                  onClick={() => handleCategorySelect(cat)}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                                      style={{ backgroundColor: cat.color || '#6B7280' }}
                                    >
                                      <IconComp />
                                    </div>
                                    <span>{cat.name}</span>
                                  </div>
                                  <span className="text-xs text-gray-500">({cat.type})</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        {/* Show create option if input doesn't match existing categories */}
                        {categoryInput.length > 0 && !categories.some(cat => 
                          cat.name.toLowerCase() === categoryInput.toLowerCase()
                        ) && (
                          <div>
                            {filteredCategories.length > 0 && <div className="border-t border-gray-200"></div>}
                            <div
                              onClick={handleCreateCategory}
                              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-blue-600 font-medium flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              <span>Create "{categoryInput}"</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Show message if no categories */}
                        {categories.length === 0 && (
                          <div className="px-4 py-3 text-center text-gray-500">
                            <div className="mb-2">No categories found</div>
                            <button
                              onClick={handleCreateCategory}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Create your first category
                            </button>
                          </div>
                        )}
                        
                        {/* Show message if no matches */}
                        {categoryInput.length > 0 && filteredCategories.length === 0 && categories.some(cat => 
                          cat.name.toLowerCase() !== categoryInput.toLowerCase()
                        ) && (
                          <div className="px-4 py-3 text-center text-gray-500">
                            <div className="mb-2">No categories match "{categoryInput}"</div>
                            <button
                              onClick={handleCreateCategory}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Create "{categoryInput}"
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Show selected category info */}
                  {form.category && !categoryInput && (() => {
                    const selectedCategory = categories.find(cat => cat._id === form.category);
                    const IconComp = CATEGORY_ICONS.find(c => c.label === selectedCategory?.icon)?.icon || FaDonate;
                    return selectedCategory ? (
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm"
                            style={{ backgroundColor: selectedCategory.color || '#6B7280' }}
                          >
                            <IconComp />
                          </div>
                          <span className="text-sm font-medium">
                            {selectedCategory.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({selectedCategory.type})
                          </span>
                        </div>
                      </div>
                    ) : null;
                  })()}
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
              <div className="bg-blue-600 text-white p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <h3 className="text-lg sm:text-xl font-bold">Recent Transactions</h3>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <select
                      value={filterType}
                      onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                      className="px-3 py-2 rounded-lg bg-white text-gray-800 border border-gray-200 text-sm w-full sm:w-auto"
                    >
                      <option value="all">All Types</option>
                      <option value="income">Income Only</option>
                      <option value="expense">Expense Only</option>
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-white text-gray-800 border border-gray-200 text-sm w-full sm:w-auto"
                    >
                      <option value="date">Sort by Date</option>
                      <option value="amount">Sort by Amount</option>
                    </select>
                  </div>
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
                    const IconComp = CATEGORY_ICONS.find(c => c.label === category?.icon)?.icon || FaDonate;
                    return (
                      <div key={tx._id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                          {/* Left side - Icon and transaction info */}
                          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                            <div
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                              style={{ backgroundColor: category?.color || '#6B7280' }}
                            >
                              <IconComp />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{tx.description || 'No description'}</h4>
                              <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 mt-1">
                                <span className="truncate">{category?.name || 'Unknown Category'}</span>
                                <span className="flex-shrink-0">•</span>
                                <span className="flex-shrink-0">{new Date(tx.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Right side - Amount, type, and buttons */}
                          <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                            <div className="text-right">
                              <p className={`text-sm sm:text-lg font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                              </p>
                              <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium ${tx.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {tx.type}
                              </span>
                            </div>
                            
                            {/* Edit and Delete Buttons */}
                            <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                              <button
                                onClick={() => handleEdit(tx)}
                                className="px-2 sm:px-3 py-1 bg-blue-500 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(tx._id)}
                                className="px-2 sm:px-3 py-1 bg-red-500 text-white text-xs sm:text-sm rounded-lg hover:bg-red-600 transition-colors"
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
                <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <p className="text-sm text-gray-700 text-center sm:text-left">
                      Showing {startIndex + 1}-{Math.min(startIndex + transactionsPerPage, filteredTransactions.length)} of {filteredTransactions.length}
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-2 text-sm text-gray-700 font-medium">
                        {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Modal */}
        <CategoryModal
          open={showCategoryModal}
          onClose={handleCategoryModalClose}
          onSave={handleCategoryModalSave}
          categoryName={categoryInput}
          categoryType={form.type}
        />
      </div>
    </div>
  );
}
