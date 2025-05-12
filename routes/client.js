const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.get(['/', '/dashboard'], clientController.dashboard);
router.get('/services', clientController.services);
router.post('/order', clientController.orderService);
router.get('/order/address-prompt/:serviceId', clientController.getAddressPrompt);
router.get('/orders', clientController.orders);
router.post('/orders/:id/edit', clientController.editOrderAddress);
router.post('/orders/:id/edit-phone', clientController.editOrderPhone);
router.post('/orders/:id/cancel', clientController.cancelOrder);

router.post('/wishlist/add', clientController.addToWishlist);
router.post('/wishlist/remove', clientController.removeFromWishlist);
router.get('/wishlist', clientController.wishlist);

module.exports = router;
