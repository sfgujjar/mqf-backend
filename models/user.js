const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  whatsapp: { type: String, unique: true, required: true },
  gmail: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  referralCode: { type: String, default: null },
  referralChain: { type: [String], default: [] },
  balance: { type: Number, default: 0 },
  totalEarning: { type: Number, default: 0 },
  totalWithdrawal: { type: Number, default: 0 },
  teamEarning: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);
