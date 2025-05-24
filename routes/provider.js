const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');

function authRole(role) {
    return (req, res, next) => {
        if (req.session.user?.role === role) return next();
        res.redirect('/login');
    };
}

router.get('/dashboard', authRole('provider'), providerController.dashboard);
router.get('/orders', authRole('provider'), providerController.orders);
router.get('/revenue', authRole('provider'), providerController.revenue);
router.post('/orders/:id/accept', authRole('provider'), providerController.acceptOrder);
router.post('/orders/:id/cancel', authRole('provider'), providerController.cancelOrder);

router.get('/services', authRole('provider'), providerController.listServices);
router.get('/services/new', authRole('provider'), providerController.getNewService);
router.post('/services', authRole('provider'), providerController.createService);
router.post('/services/:id/delete', authRole('provider'), providerController.softDeleteService);
router.get('/services/deleted', authRole('provider'), providerController.deletedServices);
router.post('/services/:id/restore', authRole('provider'), providerController.restoreService);
router.post('/services/bulk-edit', authRole('provider'), providerController.bulkEdit);

module.exports = router;
