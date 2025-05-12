const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

function authRole(role) {
    return (req, res, next) => {
        if (req.session.user?.role === role) return next();
        res.redirect('/login');
    };
}

router.get('/dashboard', authRole('admin'), adminController.dashboard);
router.get('/revenue', authRole('admin'), adminController.revenue);

// Category CRUD
router.get('/categories', authRole('admin'), adminController.listCategories);
router.get('/categories/new', authRole('admin'), adminController.getNewCategory);
router.post('/categories', authRole('admin'), adminController.addCategory);
router.post('/categories/:id/delete', authRole('admin'), adminController.deleteCategory);

module.exports = router;
