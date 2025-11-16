const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true }, // reference
  description: { type: String },
  date: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Transactions', transactionSchema);
