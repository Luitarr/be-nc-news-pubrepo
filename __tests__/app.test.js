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
   
    return seed(data)
})


describe('GET /api/topics',()=>{
    test ('200:responds with an array of topics', ()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body})=>{
            const {topics}=body;
          
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

describe('GET /api/articles/:article_id',()=>{
    test ('200:responds with an article object based on id', ()=>{
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body})=>{
          
            expect(body.article).toMatchObject({
                title: "Living in the shadow of a great man",
                topic: "mitch",
                article_id: 1,
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(String),
                votes: 100,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              })
         })

    })

    test ('400 Error:responds with an error when id is an invalid type', ()=>{
        return request(app)
        .get('/api/articles/nonsense')
        .expect(400)
        .then(({body})=>{
           expect(body.msg).toBe('bad request')
            
         })

    })

    test ('404 Error:responds with an error when id is an invalid type', ()=>{
        return request(app)
        .get('/api/articles/nonsense')
        .expect(400)
        .then(({body})=>{
           expect(body.msg).toBe('bad request')
            
         })
       })
    })

    describe('GET /api/articles',()=>{
        test ('200:responds with an articles array of article object sorted by date(created_at) in descending order', ()=>{
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body})=>{
                console.log(body)
                const {articles}=body;
                expect(articles).toBeSortedBy('created_at',{descending: true})
                expect(articles).toHaveLength(13);
                articles.forEach((article)=>{
                    expect(article).toMatchObject({
                        author:expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                    })
                })
            })
        })
    })


