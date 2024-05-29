const express = require ('express')
const app = express()
//app.use(express.json())

const{getTopic}=require('./controllers/topics.controller')

const{getApi}= require('./controllers/api.controller')

app.get("/api/topics", getTopic);

app.get("/api", getApi);

app.all('*',(req,res)=>{
    res.status(404).send({msg:'route not found'})
})



app.use((err,req,res,next)=>{   //error 404
    if(err.code){
        res.status(404).send({msg:'not found'})
        
    }else{
        next(err)
    }
})

app.use((err,req,res,next)=>{             //error 500
    console.log(err, '<--sorry, I am broken')
    res.status(500).send({msg:"sorry, I am broken"})
})

module.exports= app