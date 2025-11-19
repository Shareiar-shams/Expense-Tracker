import React, { useState } from "react";
import {
  FaHome, FaUtensils, FaCar, FaGamepad, FaMoneyBillAlt, FaGift,
  FaHospital, FaBook, FaShoppingCart, FaDonate
} from "react-icons/fa";

const CATEGORY_ICONS = [
  { icon: FaHome, label: "Home" },
  { icon: FaUtensils, label: "Food" },
  { icon: FaCar, label: "Transport" },
  { icon: FaGamepad, label: "Entertainment" },
  { icon: FaMoneyBillAlt, label: "Salary" },
  { icon: FaGift, label: "Gift" },
  { icon: FaHospital, label: "Health" },
  { icon: FaBook, label: "Education" },
  { icon: FaShoppingCart, label: "Shopping" },
  { icon: FaDonate, label: "Donation" },
];

export default function CategoryModal({ open, onClose, onSave, categoryName = "", categoryType = "expense" }) {
  const [name, setName] = useState(categoryName);
  const [type, setType] = useState(categoryType);
  const [color, setColor] = useState("#4ECDC4");
  const [icon, setIcon] = useState("Home");

  if (!open) return null;

  const handleSubmit = () => {
    if (!name.trim()) return alert("Please enter a category name.");

    onSave({ name, type, color, icon });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">Create Category</h2>

        {/* Name */}
        <div>
          <label className="text-sm font-medium">Category Name</label>
          <input
            type="text"
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Type */}
        <div className="mt-4">
          <label className="text-sm font-medium">Category Type</label>
          <select
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* Icons */}
        <div className="mt-4">
          <label className="text-sm font-medium">Select Icon</label>
          <div className="grid grid-cols-5 gap-3 mt-2">
            {CATEGORY_ICONS.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl transition-all hover:scale-110 ${
                    icon === item.label
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-200 hover:border-blue-300 text-gray-600"
                  }`}
                  onClick={() => setIcon(item.label)}
                  title={item.label}
                >
                  <IconComp />
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Picker */}
        <div className="mt-4">
          <label className="text-sm font-medium">Color</label>
          <input
            type="color"
            className="w-full h-10 mt-1 rounded cursor-pointer border-2 border-gray-300"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Category
          </button>
        </div>
      </div>
    </div>
  );
}
