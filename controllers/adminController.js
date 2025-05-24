const Category = require('../models/Category');
const Order = require('../models/Order');
const Service = require('../models/Service'); // <-- Make sure this is included

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

// SOFT DELETE SERVICE (for admin)
exports.softDeleteService = async (req, res) => {
    try {
        await Service.findByIdAndUpdate(req.params.id, { $set: { deletedAt: new Date() } });
        res.redirect('/admin/services');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/services');
    }
};

// Recently deleted services (admin view)
exports.deletedServices = async (req, res) => {
    try {
        const services = await Service.find({ deletedAt: { $ne: null } })
            .sort('-deletedAt')
            .populate('provider')
            .populate('category');
        res.render('admin/deleted-services', { services });
    } catch (error) {
        console.error(error);
        res.redirect('/admin/dashboard');
    }
};

// Restore deleted service
exports.restoreService = async (req, res) => {
    try {
        await Service.findByIdAndUpdate(req.params.id, { $set: { deletedAt: null } });
        res.redirect('/admin/services/deleted');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/services/deleted');
    }
};

// (Optional) Soft delete category (if you want to use soft delete for categories)
exports.softDeleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        category.deletedAt = new Date();
        await category.save();
        res.redirect('/admin/categories');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/categories');
    }
};
