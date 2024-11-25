const request = require('supertest');
const app = require('../app');

describe('web', () => {

    let clientToken = ""
    let ComerToken = ""
    let id = ""
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
        ComerToken = response.body.token
    })
    it('should create a single web', async () => {
        const response = await request(app)
            .post('/api/web/')
            .auth(ComerToken, { type: 'bearer' })
            .send({
                "city": "Trujillo",
                "activity": "Futbol",
                "tittle": "Ven a jugar futbol",
                "sumary": "Nos enfocamos en realizar competencias de futbol",
                "text": [],
                "img": [],
                "client_review": {
                  "scoring": [],
                  "total_score": 0,
                  "reviews": []
                }
              })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.city).toEqual('Trujillo')
        expect(response.body.activity).toEqual('Futbol')
        expect(response.body.tittle).toEqual('Ven a jugar futbol')
        id = response.body._id
    })
    it('should get the webs, by id, by city, by activity or by scoring', async () => {
        const response = await request(app)
            .get(`/api/web`)
            // .query({ city: 'trujillo' },
            //     {act: 'futbol' },
            //     {id: id},
            //     {scoring: true}
            // )
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.pop().activity).toEqual('Futbol')
    });

    it('should get the clients by activity or city', async () => {
        const response = await request(app)
            .get(`/api/web/clients/`)
            .query({ interest: 'yoga' , city: 'arequipa'})
            .auth(ComerToken, { type: 'bearer' }) 
            .set('Accept', 'application/json')
            .expect(200);
        expect(response.body[0].interests).toContain('yoga');
        expect(response.body[0].city).toEqual('Arequipa');
        expect(response.body[0].spam).toBe(true);
    });
    
    it('should update a comerce', async () => {
        const response = await request(app)
            .put(`/api/web/${id}`)
            .auth(ComerToken, { type: 'bearer' })
            .send({
                "city": "Water 7",
                "activity": "Anime",
                "tittle": "Ven a ver Anime",
                "sumary": "Nos encanta el anime",
                "text": [],
                "img": [],
                "client_review": {
                  "scoring": [],
                  "total_score": 0,
                  "reviews": []
                }
              })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.city).toEqual('Water 7')
        expect(response.body.activity).toEqual('Anime')
        expect(response.body.tittle).toEqual('Ven a ver Anime')
    })

    it('should patch a text in a web', async () => {
        const response = await request(app)
            .patch(`/api/web/text/${id}`)
            .auth(ComerToken, { type: 'bearer' })
            .send({
                "text": ["Texto sobre anime"]
              })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.text).toEqual(["Texto sobre anime"])
    })

    it('should patch a review in a web', async () => {
        const response = await request(app)
            .patch(`/api/web/review/${id}`)
            .auth(clientToken, { type: 'bearer' })
            .send({
                "client_review": {
                 "scoring": [4],
                 "reviews": ["Muy buen artículo"]
               }
             })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.client_review.scoring).toEqual([4])
        expect(response.body.client_review.reviews).toEqual([ 'Muy buen artículo' ])
    })

    it('should archive a web', async () => {
        const response = await request(app)
            .delete(`/api/web/archive/${id}`)
            .auth(ComerToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect(200);
        expect(response.body.acknowledged).toEqual(true);
    });

    it('should delete a web', async () => {
        const response = await request(app)
            .delete(`/api/web/${id}`)
            .auth(ComerToken, { type: 'bearer' })
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

