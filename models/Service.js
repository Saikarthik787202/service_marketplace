const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    price: Number,
    deletedAt: Date,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Service', serviceSchema);
