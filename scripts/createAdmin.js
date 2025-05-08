const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/taskswift', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function createAdmin() {
    const existing = await User.findOne({ email: 'admin@admin.com' });
    if (existing) {
        console.log('Admin already exists');
        return mongoose.disconnect();
    }
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
        name: 'Admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        role: 'admin'
    });
    console.log('Admin user created!');
    mongoose.disconnect();
}

createAdmin();
