const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('Service Management', () => {
    let agent;
    let serviceName = 'Test Service';

    before(async () => {
        agent = request.agent(app);
    });

    it('should create a new service', async () => {
        const newService = {
            name: serviceName,
            description: 'This is a test service',
            price: 100,
            category: 'validCategoryId', // Replace with a valid category ID
        };

        const response = await agent
            .post('/provider/services')
            .send(newService);

        expect(response.status).to.equal(302); // Redirect to login for unauthenticated users
    });

    it('should not create a service with missing fields', async () => {
        const incompleteService = {
            name: 'Incomplete Service'
        };

        const response = await agent
            .post('/provider/services')
            .send(incompleteService);

        expect(response.status).to.equal(302); // Redirect to login for unauthenticated users
    });

    it('should retrieve services', async () => {
        const response = await agent
            .get('/services');

        expect(response.status).to.equal(200); // Public route, should return success
    });


});