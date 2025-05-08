const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/taskswift', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function createUser(name, email, password, role) {
    const existing = await User.findOne({ email });
    if (existing) {
        console.log('User already exists');
        return mongoose.disconnect();
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        isActive: true
    });
    console.log('User created!');
    mongoose.disconnect();
}

// Usage: node scripts/createUser.js NAME EMAIL PASSWORD ROLE
const [, , name, email, password, role] = process.argv;
if (!name || !email || !password || !role) {
    console.log('Usage: node scripts/createUser.js NAME EMAIL PASSWORD ROLE');
    process.exit(1);
}
createUser(name, email, password, role);
