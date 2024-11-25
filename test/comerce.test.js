const request = require('supertest');
const app = require('../app')

describe('comerce', () => {

    let clientToken = ""
    it('should login a client', async () => {
        const response = await request(app)
            .post('/api/clients/login')
            .send({ 
                "email": "ana.lopez@example.com", 
                "password": "password456", 
            })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.client.email).toEqual('ana.lopez@example.com')
        clientToken = response.body.token
    })
    it('should create a comerce', async () => {
        const response = await request(app)
            .post('/api/comerce/')
            .auth(clientToken, { type: 'bearer' })
            .send({
                "name": "Pe Cause Industries",
                "cif": "FLDSMDFR",
                "adress": "281 Calle Tupac Amaru, Iquitos",
                "email": "contacto@causeintustries.com",
                "phone": "+34 321 763 789",
                "id_page": null
            })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.comerce.email).toEqual('contacto@causeintustries.com')
        expect(response.body.comerce.cif).toEqual('FLDSMDFR')
    })
    it('should get the comerces', async () => {
        const response = await request(app)
            .get('/api/comerce')
            .auth(clientToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.pop().name).toEqual('Pe Cause Industries')
    });
    it('should update a comerce', async () => {
        const response = await request(app)
            .put(`/api/comerce/`)
            .query({ cif: 'FLDSMDFR' })
            .auth(clientToken, { type: 'bearer' })
            .send({
                "name": "Arepa Tech",
                "cif": "FLDSMDFR",
                "adress": "281 Calle Cuycito, Cuzco",
                "email": "contacto@arepatech.com",
                "phone": "+34 321 763 789",
                "id_page": null
            })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.data.name).toEqual('Arepa Tech')
        expect(response.body.data.email).toEqual('contacto@arepatech.com')
        expect(response.body.data.cif).toEqual('FLDSMDFR')
    })
    it('should archive a comerce', async () => {
        const response = await request(app)
            .delete(`/api/comerce/archive`)
            .query({ cif: 'FLDSMDFR' })
            .auth(clientToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect(200);
        expect(response.body.acknowledged).toEqual(true);
    });
    it('should delete a comerce', async () => {
        const response = await request(app)
            .delete(`/api/comerce`)
            .query({ cif: 'FLDSMDFR' })
            .auth(clientToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect(200);
        expect(response.body.acknowledged).toEqual(true);
    });
})

