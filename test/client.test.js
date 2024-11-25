const request = require('supertest');
const app = require('../app')

describe('client', () => {

    let token = ""    
    let id = ""
    it('should register a client', async () => {
        const response = await request(app)
            .post('/api/clients/register')
            .send({ 
                "name": "Menganito", 
                "email": "user25@test.com", 
                "password": "HolaMundo.01", 
                "age": "30", 
                "city": "Lima", 
                "interests": ["turismo", "lectura", "viajes"], 
                "spam": true })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.client.email).toEqual('user25@test.com')
        expect(response.body.client.role).toEqual(["client"])
        id = response.body.client._id
    })
    it('should login a client', async () => {
        const response = await request(app)
            .post('/api/clients/login')
            .send({ 
                "email": "user25@test.com", 
                "password": "HolaMundo.01", 
            })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.client.email).toEqual('user25@test.com')
        token = response.body.token
    })
    it('should update a client', async () => {
        const response = await request(app)
            .put(`/api/clients/update/${id}`)
            .auth(token, { type: 'bearer' })
            .send({
                name: 'Noam',
                email: 'noam@test.com',
                password: 'HolaMundo.02',
                age: '12',
                city: 'Iquitos',
                interests: ['sidigue', 'anime', 'manga'],
                spam: false
            })
            .set('Accept', 'application/json')
            .expect(200);
        expect(response.body.email).toEqual('noam@test.com')
        expect(response.body.name).toEqual('Noam')
        expect(response.body.interests).toEqual(['sidigue', 'anime', 'manga'])
    });
    it('should delete a user', async () => {
        const response = await request(app)
            .delete(`/api/clients/delete/${id}`)
            .auth(token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.acknowledged).toEqual(true)
    })
})

