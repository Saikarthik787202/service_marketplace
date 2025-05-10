const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    status: { type: String, default: 'pending' },
    address: String,
    phone: String,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', orderSchema);
