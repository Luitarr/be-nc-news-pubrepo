const express = require ('express')
const app = express()


const{getTopic}=require('./controllers/topics.controller')

const{getApi}= require('./controllers/api.controller')

const{getArticleById}= require('./controllers/articles.controller')

app.get("/api/topics", getTopic);

app.get("/api", getApi);

app.get('/api/articles/:article_id', getArticleById);





app.all('*',(req,res)=>{  //as per NC notes error handling
    res.status(404).send({msg:'route not found'})
})



app.use((err,req,res,next)=>{   //error 400 
    if(err.code){ //psql eror code
        res.status(400).send({msg:'bad request'})
        
    }else{
        next(err)
    }
})

app.use((err,req,res,next)=>{             //error 500
    console.log(err, '<--sorry, I am broken')
    res.status(500).send({msg:"sorry, I am broken"})
})

module.exports= app