import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import FormInput from '../components/FormInput';
import Swal from 'sweetalert2';
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

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'expense', icon: '', color: '#4ECDC4' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.categories || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('token');
      
      if (editingId) {
        // Update existing category
        await axios.put(`/categories/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Category updated successfully!');
        setEditingId(null);
      } else {
        // Create new category
        await axios.post('/categories', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Category created successfully!');
      }

      setForm({ name: '', type: 'expense', icon: '', color: '#4ECDC4' });
      fetchCategories();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editingId ? 'update' : 'create'} category`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setForm({
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color
    });
    setEditingId(category._id);
    setError('');
    setSuccess('');
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', type: 'expense', icon: '', color: '#4ECDC4' });
    setError('');
  };

  const handleDelete = async (id, categoryName) => {
    const result = await Swal.fire({
      title: 'Delete Category?',
      text: `Are you sure you want to delete "${categoryName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      Swal.fire({
        title: 'Deleted!',
        text: 'Category has been deleted successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      
      fetchCategories();
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || 'Failed to delete category',
        icon: 'error',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  const handleIconSelect = (iconLabel) => setForm({ ...form, icon: iconLabel });

  useEffect(() => { fetchCategories(); }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Category Management
          </h1>
          <p className="text-gray-600">Organize your transactions with custom categories.</p>
        </div>

        {/* Error / Success */}
        {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
        {success && <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}

        {/* Flex layout: Form & Categories */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="lg:w-1/3 bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? 'Edit Category' : 'Create New Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="Category Name"
                type="text"
                placeholder="Enter category name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              {/* Type */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Category Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Choose Icon</label>
                <div className="grid grid-cols-5 md:grid-cols-5 gap-3">
                  {CATEGORY_ICONS.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handleIconSelect(item.label)}
                        className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl transition-all hover:scale-110 ${
                          form.icon === item.label
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:border-blue-300 text-gray-600'
                        }`}
                        title={item.label}
                      >
                        <IconComp />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Choose Color</label>
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-full h-12 rounded-lg border-2 border-gray-300 cursor-pointer transition-all hover:border-blue-400"
                />
              </div>

              {/* Submit Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {submitting ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Category' : 'Create Category')}
                </button>
                
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full bg-gray-500 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-all shadow-md hover:shadow-lg"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Categories List */}
          <div className="lg:flex-1 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gray-100 text-gray-800 p-5 font-semibold">Your Categories</div>
            {categories.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="text-6xl mb-4">📝</div>
                <h4 className="text-xl font-semibold mb-2">No categories yet</h4>
                <p>Create your first category to start organizing your transactions.</p>
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const IconComp = CATEGORY_ICONS.find(c => c.label === cat.icon)?.icon || FaDonate;
                  return (
                    <div key={cat._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0"
                            style={{ backgroundColor: cat.color }}
                          >
                            <IconComp />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 truncate">{cat.name}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              cat.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {cat.type}
                            </span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2 ml-2">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit category"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id, cat.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete category"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
