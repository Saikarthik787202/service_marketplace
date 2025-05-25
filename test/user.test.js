const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('User Management', () => {
    let agent;

    before(async () => {
        agent = request.agent(app);
    });

    it('should create a new user', async () => {
        // First get the registration page to handle CSRF token
        await agent.get('/register');
        
        const newUser = {
            name: 'New User 4',
            email: 'newuser4@example.com',
            password: 'password123',
            role: 'client'
        };

        const response = await agent
            .post('/register')
            .type('form')
            .send(newUser);

        expect(response.status).to.equal(302); // Successful registration redirects to login page
    });



    it('should log in the user', async () => {
        // First get the login page to handle CSRF token
        await agent.get('/login');
        
        const response = await agent
            .post('/login')
            .type('form')
            .send({ email: 'saikarthikmurari488@gmail.com', password: 'Karthik@488' });

        expect(response.status).to.equal(302); // Successful login redirects to dashboard
    });

    it('should not log in with incorrect password', async () => {
        // First get the login page to handle CSRF token
        await agent.get('/login');
        
        const response = await agent
            .post('/login')
            .type('form')
            .send({ email: 'saikarthikmurari488@gmail.com', password: 'wrongpassword' });

        expect(response.status).to.equal(200); // Renders login page with error
        expect(response.text).to.include('Invalid password!');
    });
});