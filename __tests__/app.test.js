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

    describe('GET /api/articles/:article_id/comments',()=>{
        test ('200:responds with an array of comments for the given article_id ', ()=>{
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body})=>{
                const {comments}=body;
                expect(comments).toBeSortedBy('created_at',{descending: true})
                expect(comments).toHaveLength(11)
               comments.forEach((comment)=>{
                expect(comment).toMatchObject({
                    comment_id:expect.any(Number),
                    votes: expect.any(Number),
                    article_id: expect.any(Number),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                })
               })

          
        
            })

            })
    

        
            test ('400 Error:responds with an error when id is an invalid type', ()=>{
                return request(app)
                .get('/api/articles/nonsense/comments')
                .expect(400)
                .then(({body})=>{
                   expect(body.msg).toBe('bad request')
                    
                 })
})

test ('404 Error:responds with an error when id is a valid type but an invalid value', ()=>{
    return request(app)
    .get('/api/articles/999/comments')
    .expect(404)
    .then(({body})=>{
       expect(body.msg).toBe('not found')
        
     })
})
    })


    describe('POST /api/articles/:article_id/comments',()=>{
        test ('201:responds with posted comment', ()=>{
            const newComment = {
                author: 'icellusedkars',
                body: "The owls are not what they seem."
              };
          
            return request(app)
            .post('/api/articles/9/comments')
            .send(newComment)
         
            .expect(201)
            .then(({body})=>{
                const {comments}=body;
           
               
                expect(comments).toEqual
                ({
                 
                    author: 'icellusedkars',
                    body: "The owls are not what they seem.",
                  
                })
               })

          
        
            })

            test ('404:responds with an error msg when article_id is not found', ()=>{
                const newComment = {
                    author: 'icellusedkars',
                    body: "The owls are not what they seem."
                  };
              
                return request(app)
                .post('/api/articles/999/comments')
                .send(newComment)
             
                .expect(404)
                .then(({body})=>{
               
                 expect(body.msg).toBe("not found")
               
           })
        })

        test ('400:responds with an error msg when required fields are incomplete', ()=>{
            const newComment = {
                author: 'icellusedkars'
                
              };
          
            return request(app)
            .post('/api/articles/9/comments')
            .send(newComment)
         
            .expect(400)
            .then(({body})=>{
         
             expect(body.msg).toBe("bad request")
           
         })
       })

       test ('400 Error:responds with an error when id is a valid type but an invalid value', ()=>{
        const newComment = {
            author: 'icellusedkars',
            body: "The owls are not what they seem."
          };
        return request(app)
        .post('/api/articles/banana/comments')
        .send(newComment)
        .expect(400)
        .then(({body})=>{
           expect(body.msg).toBe('bad request')
            
         })
    })
    test ('404:responds with an error msg when username does not exist', ()=>{
        const newComment = {
            author: 'banana',
            body: "The owls are not what they seem."
          };
      
        return request(app)
        .post('/api/articles/9/comments')
        .send(newComment)
     
        .expect(404)
        .then(({body})=>{
       
         expect(body.msg).toBe("username not found")
       
   })
})

     
     })

     describe('PATCH /api/articles/:article_id',()=>{
        test ('200:responds with a modified article', ()=>{
            const newVote=1
            const newPatch={inc_votes: newVote}
            return request(app)
            .patch('/api/articles/1')
            .send(newPatch)
            .expect(200)
            .then(({body})=>{
                expect(body.article).toMatchObject({
                    title:"Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body:"I find this existence challenging",
                    votes:101,
                    created_at: expect.any(String),
                    article_img_url:
                    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                })
            }) 
        })

        test ('400:responds with an error message for invalid id type', ()=>{
            const newVote=1
            const newPatch={inc_votes: newVote}
            return request(app)
            .patch('/api/articles/banana')
            .send(newPatch)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe('bad request')
                
                
            }) 
        })

        test ('404:responds with an error message for id not found', ()=>{
            const newVote=1
            const newPatch={inc_votes: newVote}
            return request(app)
            .patch('/api/articles/999')
            .send(newPatch)
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe('not found')
            }) 
        })

        test ('400:responds with an error message for an incorrect body', ()=>{
            const newVote="1"
            const newPatch={inc_votes: newVote}
            return request(app)
            .patch('/api/articles/1')
            .send(newPatch)
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe('bad request')
            }) 
        })

      
    })

    describe('DELETE /api/comments/:comment_id',()=>{
        test.only('204: responds with no content when comment is deleted', () => {
            return request(app)
                .delete('/api/comments/1')
                .expect(204);
               
          
               
        });
        test.only('404: responds with an error message when comment_id does not exist', () => {
            return request(app)
                .delete('/api/comments/9999')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('comment not found');
                });
        });
    
        test.only('400: responds with an error message when comment_id is invalid', () => {
            return request(app)
                .delete('/api/comments/banana')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('bad request');
                });
        });
    
    })


    







