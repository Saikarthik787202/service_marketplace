const Service = require('../models/Service');
const Order = require('../models/Order');
const Category = require('../models/Category');
const User = require('../models/User');

// Dashboard with grid, featured categories, and featured products
exports.dashboard = async (req, res) => {
    const categories = await Category.find({ deletedAt: null });
    const featuredServices = await Service.find({ deletedAt: null }).sort({ createdAt: -1 }).limit(6);
    res.render('client/dashboard', { categories, featuredServices });
};

// Services page with category filter
exports.services = async (req, res) => {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const services = await Service.find({ ...filter, deletedAt: null }).populate('category provider');
    const categories = await Category.find({ deletedAt: null });
    res.render('client/services', { services, categories, category });
};

// Purchase Service (address/phone prompt)
exports.orderService = async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const user = await User.findById(req.session.user._id);
    let address = user.address;
    let phone = user.phone;
    if (req.body.address) {
        address = req.body.address;
        user.address = address;
    }
    if (req.body.phone) {
        phone = req.body.phone;
        user.phone = phone;
    }
    await user.save();
    if (!address || !phone) {
        const service = await Service.findById(req.body.serviceId);
        return res.render('client/address-prompt', { serviceId: req.body.serviceId, service });
    }
    const order = new Order({
        user: req.session.user._id,
        service: req.body.serviceId,
        status: 'pending',
        address,
        phone
    });
    await order.save();
    res.redirect('/orders');
};

// Address prompt page (GET, optional)
exports.getAddressPrompt = async (req, res) => {
    const service = await Service.findById(req.params.serviceId);
    res.render('client/address-prompt', { serviceId: req.params.serviceId, service });
};

// Orders Page: improved UI, newest first, cancel only if pending
exports.orders = async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const orders = await Order.find({ user: req.session.user._id })
        .populate('service')
        .sort({ createdAt: -1 }); // Newest first
    res.render('client/orders', { orders });
};

// Edit Order Address
exports.editOrderAddress = async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const order = await Order.findById(req.params.id);
    if (order && String(order.user) === String(req.session.user._id)) {
        order.address = req.body.address;
        await order.save();
    }
    res.redirect('/orders');
};

// Edit Order Phone
exports.editOrderPhone = async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const order = await Order.findById(req.params.id);
    if (order && String(order.user) === String(req.session.user._id)) {
        order.phone = req.body.phone;
        await order.save();
    }
    res.redirect('/orders');
};

// Cancel order (user) - only if pending
exports.cancelOrder = async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const order = await Order.findById(req.params.id);
    if (
        order &&
        String(order.user) === String(req.session.user._id) &&
        order.status === 'pending'
    ) {
        order.status = 'cancelled';
        await order.save();
    }
    res.redirect('/orders');
};

// Wishlist logic
exports.addToWishlist = (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    if (!req.session.wishlist) req.session.wishlist = [];
    if (!req.session.wishlist.includes(req.body.serviceId)) {
        req.session.wishlist.push(req.body.serviceId);
    }
    res.redirect('/services');
};

exports.removeFromWishlist = (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    req.session.wishlist = (req.session.wishlist || []).filter(id => id !== req.body.serviceId);
    res.redirect('/wishlist');
};

exports.wishlist = async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const wishlist = req.session.wishlist || [];
    const services = await Service.find({ _id: { $in: wishlist } });
    res.render('client/wishlist', { services });
};
