// seed.js
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Service = require('./models/Service');
const User = require('./models/User');

async function seed() {
    await mongoose.connect('mongodb://localhost:27017/taskswift', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // Clean up old data
    await Category.deleteMany({});
    await Service.deleteMany({});
    await User.deleteMany({});

    // Create sample providers
    const provider1 = await User.create({ email: 'provider1@example.com', password: 'pw1', role: 'provider', name: 'Provider One' });
    const provider2 = await User.create({ email: 'provider2@example.com', password: 'pw2', role: 'provider', name: 'Provider Two' });

    // Create sample categories
    const categories = await Category.insertMany([
        { name: 'Plumbing' },
        { name: 'Electrical' },
        { name: 'Cleaning' },
        { name: 'Landscaping' }
    ]);

    // Create sample services
    await Service.insertMany([
        {
            name: 'Fix Leaky Faucet',
            description: 'We fix all types of leaky faucets quickly.',
            image: '',
            category: categories[0]._id,
            provider: provider1._id,
            price: 50,
            deletedAt: null
        },
        {
            name: 'Install Light Fixture',
            description: 'Professional light fixture installation.',
            image: '',
            category: categories[1]._id,
            provider: provider1._id,
            price: 80,
            deletedAt: null
        },
        {
            name: 'Deep Cleaning',
            description: 'Thorough cleaning for your home or office.',
            image: '',
            category: categories[2]._id,
            provider: provider2._id,
            price: 120,
            deletedAt: null
        },
        {
            name: 'Lawn Mowing',
            description: 'Quick and affordable lawn mowing.',
            image: '',
            category: categories[3]._id,
            provider: provider2._id,
            price: 60,
            deletedAt: null
        }
    ]);

    console.log('Database seeded!');
    mongoose.connection.close();
}

seed().catch(err => {
    console.error(err);
    mongoose.connection.close();
});
