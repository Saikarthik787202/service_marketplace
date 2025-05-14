const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const app = express();

mongoose.connect('mongodb://localhost:27017/taskswift', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Make user available in all EJS views
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

app.set('view engine', 'ejs');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const providerRoutes = require('./routes/provider');
const clientRoutes = require('./routes/client');

app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use('/provider', providerRoutes);
app.use(clientRoutes);

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
