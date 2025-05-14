const Category = require('../models/Category');
const Order = require('../models/Order');

// Dashboard
exports.dashboard = (req, res) => {
    res.render('admin/dashboard');
};

// Revenue Dashboard
exports.revenue = async (req, res) => {
    const orders = await Order.find({ status: 'accepted' })
        .populate({
            path: 'service',
            populate: { path: 'provider' }
        })
        .populate('user');
    const providerMap = {};
    let totalRevenue = 0;
    orders.forEach(order => {
        if (order.service && order.service.provider) {
            const pid = String(order.service.provider._id);
            const pname = order.service.provider.name;
            const price = order.service.price || 0;
            if (!providerMap[pid]) {
                providerMap[pid] = { name: pname, revenue: 0 };
            }
            providerMap[pid].revenue += price;
            totalRevenue += price;
        }
    });
    res.render('admin/revenue', {
        providerRevenues: Object.values(providerMap),
        totalRevenue,
        orders
    });
};

// Category CRUD
exports.listCategories = async (req, res) => {
    const categories = await Category.find({});
    res.render('admin/categories', { categories });
};

exports.getNewCategory = (req, res) => {
    res.render('admin/new-category');
};

exports.addCategory = async (req, res) => {
    await Category.create({ name: req.body.name });
    res.redirect('/admin/categories');
};

exports.deleteCategory = async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/admin/categories');
};
