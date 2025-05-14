const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getLogin = (req, res) => {
    res.render('auth/login', { error: null });
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, deletedAt: null });
    if (!user) return res.render('auth/login', { error: 'No such user or user deleted!' });
    if (!user.isActive) return res.render('auth/login', { error: 'Your account is disabled!' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.render('auth/login', { error: 'Invalid password!' });
    req.session.user = user;
    if (user.role === 'admin') return res.redirect('/admin/dashboard');
    if (user.role === 'provider') return res.redirect('/provider/dashboard');
    return res.redirect('/dashboard');
};

exports.getRegister = (req, res) => {
    res.render('auth/register', { error: null });
};

exports.postRegister = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
            isActive: true
        });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        res.render('auth/register', { error: 'Registration failed. Email may already be used.' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};
