const express = require ('express')
const app = express()
const cors = require('cors');
app.use(express.json())
app.use(cors());


const{getTopic}=require('./controllers/topics.controller')

const{getApi}= require('./controllers/api.controller')

const{getArticleById}= require('./controllers/articles.controller')

const{getArticles}= require('./controllers/articlesSortedByDate.controller')
const{getComments}= require('./controllers/commentsByArtId.controller')
const{postComment}=require('./controllers/postComment.controller')
const{patchArticleVote}=require('./controllers/patch.controller')
const{deleteComment}=require('./controllers/deleteComment.controller')

app.get("/api/topics", getTopic);

app.get("/api", getApi);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getComments)


app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id',patchArticleVote)

app.delete('/api/comments/:comment_id', deleteComment)

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

app.use((err,req,res,next)=>{   //custom
    if(err.status && err.msg){
        res.status(err.status).send({msg:err.msg})
        
    }else{
        next(err)  
    }
})


app.use((err,req,res,next)=>{             //error 500
    console.log(err, '<--sorry, I am broken')
    res.status(500).send({msg:"sorry, I am broken"})
})

module.exports= app