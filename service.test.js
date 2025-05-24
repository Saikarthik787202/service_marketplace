const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('Service Creation', () => {
    let agent;

    before(async () => {
        agent = request.agent(app);
        await agent
            .post('/api/auth/login')
            .send({ email: 'saikarthikmurari488', password: 'Karthik@488' });
    });

    it('should create a new service', async () => {
        const newService = {
            name: 'Test Service',
            description: 'This is a test service',
            price: 100,
            category: 'Cleaning', // Replace with a valid category ID
        };

        const response = await agent
            .post('/api/services')
            .send(newService);

        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('service');
        expect(response.body.service.name).to.equal(newService.name);
    });

    it('should not create a service with missing fields', async () => {
        const incompleteService = {
            name: 'Incomplete Service'
        };

        const response = await agent
            .post('/api/services')
            .send(incompleteService);

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('error');
    });
});