const {addComment}=require('../models/postComment.model')

exports.postComment = (req,res,next) => {
    const { article_id } = req.params;
    console.log(req.params)

    const { author, body } = req.body;
    console.log(req.body)
  

    addComment(article_id,author,body).then((comments)=>{
        res.status(201).send({comments})
    }).catch(next)
}
