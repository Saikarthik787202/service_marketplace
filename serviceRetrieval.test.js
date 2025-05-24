const request = require('supertest');
const { expect } = require('chai');
const app = require('../app'); // Adjust the path as necessary

describe('Service Retrieval', () => {
    it('should retrieve a service by ID', async () => {
        const serviceId = '12345'; // Replace with a valid service ID

        const response = await request(app)
            .get(`/api/services/${serviceId}`) // Adjust the route as necessary

        expect(response.status).to.equal(200); // Change to .equal
        expect(response.body).to.have.property('service');
        expect(response.body.service._id).to.equal(serviceId); // Change to .equal
    });

    it('should return 404 for non-existing service', async () => {
        const nonExistingId = '54321'; // Replace with a non-existing ID

        const response = await request(app)
            .get(`/api/services/${nonExistingId}`) // Adjust the route as necessary

        expect(response.status).to.equal(404); // Change to .equal
        expect(response.body).to.have.property('error');
    });
});