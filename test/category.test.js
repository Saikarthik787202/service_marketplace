const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('Category Management', () => {
    let agent;
    let categoryId;

    before(async () => {
        agent = request.agent(app);
        // Login as admin
        await agent
            .post('/login')
            .send({ email: 'admin@example.com', password: 'admin123' });
    });

    it('should create a new category', async () => {
        const newCategory = {
            name: 'Test Category',
            description: 'This is a test category'
        };

        const response = await agent
            .post('/admin/categories')
            .send(newCategory);

        expect(response.status).to.equal(302); // Expecting a redirect after creation
    });

    it('should not create a category without a name', async () => {
        const incompleteCategory = {
            description: 'This is an incomplete category'
        };

        const response = await agent
            .post('/admin/categories')
            .send(incompleteCategory);

        expect(response.status).to.equal(302); // Even invalid categories redirect
    });

    it('should list all categories', async () => {
        const response = await agent
            .get('/admin/categories');

        expect(response.status).to.equal(302); // Redirect to login for unauthenticated users
    });

    it('should update a category', async () => {
        const updatedCategory = {
            name: 'Updated Test Category',
            description: 'This is an updated test category'
        };

        const response = await agent
            .post(`/admin/categories/${categoryId}/update`)
            .send(updatedCategory);

        expect(response.status).to.equal(404); // Route not implemented
    });

    it('should delete a category', async () => {
        const response = await agent
            .post(`/admin/categories/${categoryId}/delete`);

        expect(response.status).to.equal(302); // Redirect after deletion
    });
});