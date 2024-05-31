const{selectComments}=require('../models/commentsByArtId.model')

exports.getComments =(req,res,next)=>{

    const { article_id } = req.params;
    if (isNaN(article_id)) {
        return res.status(400).send({ msg: 'bad request' });
    }


    selectComments(article_id).then((comments)=>{
  
 res.status(200).send({comments})
    }).catch((err)=>{
        next(err)
        
     })
   
}