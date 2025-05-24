const request = require('supertest');
const { expect } = require('chai');
const app = require('../app'); // Adjust the path as necessary

describe('User Creation', () => {
    it('should create a new user', async () => {
        const newUser = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        };

        const response = await request(app)
            .post('/api/auth/register') // Adjust the route as necessary
            .send(newUser);

        expect(response.status).to.equal(201); // Change to .equal
        expect(response.body).to.have.property('user');
        expect(response.body.user.email).to.equal(newUser.email); // Change to .equal
    });

    it('should not create a user with existing email', async () => {
        const existingUser = {
            username: 'existinguser',
            email: 'testuser@example.com',
            password: 'password123'
        };

        const response = await request(app)
            .post('/api/auth/register')
            .send(existingUser);

        expect(response.status).to.equal(400); // Change to .equal
        expect(response.body).to.have.property('error');
    });
});