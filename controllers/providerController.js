const Service = require('../models/Service');
const Order = require('../models/Order');
const Category = require('../models/Category');

// Dashboard
exports.dashboard = async (req, res) => {
    const services = await Service.find({ provider: req.session.user._id, deletedAt: null }).populate('category');
    res.render('provider/dashboard', { services });
};

// Orders
exports.orders = async (req, res) => {
    const orders = await Order.find({})
        .populate({
            path: 'service',
            match: { provider: req.session.user._id }
        })
        .populate('user');
    const filteredOrders = orders.filter(order => order.service);
    res.render('provider/orders', { orders: filteredOrders });
};

// Revenue
exports.revenue = async (req, res) => {
    const orders = await Order.find({ status: 'accepted' })
        .populate({
            path: 'service',
            match: { provider: req.session.user._id }
        })
        .populate('user');
    const providerOrders = orders.filter(o => o.service);
    const totalRevenue = providerOrders.reduce((sum, o) => sum + (o.service.price || 0), 0);
    res.render('provider/revenue', { orders: providerOrders, totalRevenue });
};

// Accept order
exports.acceptOrder = async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id, { status: 'accepted' });
    res.redirect('/provider/orders');
};

// Cancel order
exports.cancelOrder = async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    res.redirect('/provider/orders');
};

// New service form
exports.getNewService = async (req, res) => {
    const categories = await Category.find({ deletedAt: null });
    res.render('provider/new-service', { categories });
};

// Create service
exports.createService = async (req, res) => {
    await Service.create({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        provider: req.session.user._id,
        price: req.body.price
    });
    res.redirect('/provider/dashboard');
};

// Delete service (soft delete)
exports.deleteService = async (req, res) => {
    await Service.findByIdAndUpdate(req.params.id, { deletedAt: new Date() });
    res.redirect('/provider/dashboard');
};
