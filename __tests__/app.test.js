const request=require('supertest');
const app = require('../app');
const db= require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const endpointsData = require('../endpoints.json')


afterAll(()=>{
    return db.end();
})

beforeEach(()=>{
    console.log('seeding!');
    return seed(data)
})


describe('GET /api/topics',()=>{
    test ('200:responds with an array of topics', ()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body})=>{
            const {topics}=body;
            console.log(topics)
            expect(topics).toHaveLength(3);
            topics.forEach((topic)=>{
                expect(topic).toMatchObject({
                    description:expect.any(String),
                    slug: expect.any(String),
                })
            })
        })
    })


    test ('404:responds with a not found message to a request to non existing endpoint', ()=>{
        return request(app)
        .get('/api/notARoute')
        .expect(404)
        .then(({body})=>{
         
            const {msg}=body;
            //console.log(msg)
            expect(msg).toBe('route not found')
               
        })
    })
})

describe('GET /api',()=>{
    test ('200:responds with an object describing all the available endpoints on my API', ()=>{
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body})=>{
            const {endpoints}=body;
            expect(endpoints).toEqual(endpointsData)
  
    })

    })

})


