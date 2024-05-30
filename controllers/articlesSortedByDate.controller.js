const{selectArticle}=require('../models/articlesSortedByDate.model')

exports.getArticles= (req,res)=>{
   
    
    selectArticle().then((articles)=>{
      
        res.status(200).send({articles})
    })
}