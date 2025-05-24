const Service = require('../models/Service');
const Category = require('../models/Category');
const Order = require('../models/Order');

// Provider Dashboard
exports.dashboard = async (req, res) => {
    const services = await Service.find({ provider: req.session.user._id, deletedAt: null }).populate('category');
    res.render('provider/dashboard', { services });
};

// List All Services (for bulk edit & delete)
exports.listServices = async (req, res) => {
    const services = await Service.find({ provider: req.session.user._id, deletedAt: null }).populate('category');
    res.render('provider/services', { services });
};

// Create New Service (form)
exports.getNewService = async (req, res) => {
    const categories = await Category.find();
    res.render('provider/new-services', { categories }); // matches your file name
};

// Create New Service (submit)
exports.createService = async (req, res) => {
    await Service.create({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        provider: req.session.user._id,
        price: req.body.price,
        deletedAt: null
    });
    res.redirect('/provider/services');
};

// Soft Delete Service
exports.softDeleteService = async (req, res) => {
    await Service.findOneAndUpdate(
        { _id: req.params.id, provider: req.session.user._id },
        { $set: { deletedAt: new Date() } }
    );
    res.redirect('/provider/services');
};

// Recently Deleted Services
exports.deletedServices = async (req, res) => {
    const services = await Service.find({ provider: req.session.user._id, deletedAt: { $ne: null } }).populate('category');
    res.render('provider/deleted-services', { services });
};

// Restore Deleted Service
exports.restoreService = async (req, res) => {
    try {
        await Service.findOneAndUpdate(
            { _id: req.params.id, provider: req.session.user._id },
            { $unset: { deletedAt: 1 } }
        );
        res.redirect('/provider/services/deleted');
    } catch (error) {
        console.error(error);
        res.redirect('/provider/services/deleted');
    }
};

// Bulk Edit Services
exports.bulkEdit = async (req, res) => {
    const { serviceIds, price, description } = req.body;
    const updateFields = {};
    if (price !== undefined && price !== '') updateFields.price = price;
    if (description !== undefined && description !== '') updateFields.description = description;

    await Service.updateMany(
        { _id: { $in: Array.isArray(serviceIds) ? serviceIds : [serviceIds] }, provider: req.session.user._id, deletedAt: null },
        { $set: updateFields }
    );
    res.redirect('/provider/services');
};

// Orders List
exports.orders = async (req, res) => {
    const orders = await Order.find({ provider: req.session.user._id })
        .populate('service')
        .populate('user');
    res.render('provider/orders', { orders });
};

// Revenue Page (if you have such a view)
exports.revenue = async (req, res) => {
    // Find all accepted orders for this provider
    const orders = await Order.find({ provider: req.session.user._id, status: 'accepted' }).populate('service');
    let totalRevenue = 0;
    orders.forEach(order => {
        if (order.service && order.service.price) {
            totalRevenue += order.service.price;
        }
    });
    res.render('provider/revenue', { totalRevenue, orders });
};


// Accept Order
exports.acceptOrder = async (req, res) => {
    await Order.findOneAndUpdate(
        { _id: req.params.id, provider: req.session.user._id },
        { $set: { status: 'accepted' } }
    );
    res.redirect('/provider/orders');
};

// Cancel Order
exports.cancelOrder = async (req, res) => {
    await Order.findOneAndUpdate(
        { _id: req.params.id, provider: req.session.user._id },
        { $set: { status: 'cancelled' } }
    );
    res.redirect('/provider/orders');
};
