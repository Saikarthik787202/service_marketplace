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

    //  providers
    const provider1 = await User.create({ email: 'karthik@example.com', password: 'pw1', role: 'provider', name: 'Karthik' });
    const provider2 = await User.create({ email: 'sanjana@example.com', password: 'pw2', role: 'provider', name: 'Sanjana' });

    // sample categories
    const categories = await Category.insertMany([
        { name: 'Plumbing' },
        { name: 'Electrical' },
        { name: 'Cleaning' },
        { name: 'Landscaping' },
        { name: 'Healthcare' },
        { name: 'Chef' }
    ]);

    // sample services
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
        },
        {
            name: 'Home Health Care',
            description: 'Professional home health care services for elderly and patients.',
            image: '',
            category: categories[4]._id,
            provider: provider1._id,
            price: 150,
            deletedAt: null
        },
        {
            name: 'Physical Therapy',
            description: 'Personalized physical therapy sessions at your home.',
            image: '',
            category: categories[4]._id,
            provider: provider2._id,
            price: 100,
            deletedAt: null
        },
        {
            name: 'Private Chef Dinner',
            description: 'Exclusive dining experience with a professional chef at your home.',
            image: '',
            category: categories[5]._id,
            provider: provider1._id,
            price: 200,
            deletedAt: null
        },
        {
            name: 'Meal Prep Service',
            description: 'Weekly meal preparation by a professional chef.',
            image: '',
            category: categories[5]._id,
            provider: provider2._id,
            price: 180,
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
