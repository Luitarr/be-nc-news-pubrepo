const {selectArticleById}=require('../models/articles.model')

exports.getArticleById = (req,res,next)=>{
    console.log(req.params)
    const{article_id}=req.params
   // console.log(article_id)// { article_id: '1' }
    
    selectArticleById(article_id).then((article)=>{
       console.log(article)
        res.status(200).send({article})
    }).catch((err)=>{
       next(err)
       //console.log(err)
    })

}