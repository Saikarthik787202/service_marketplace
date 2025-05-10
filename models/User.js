const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['client', 'provider', 'admin'] },
    address: String,
    phone: String,
    isActive: { type: Boolean, default: true },
    deletedAt: Date,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', userSchema);
