const {removeComment}=require('../models/deleteComment.model')

exports.deleteComment=(req,res,next)=>{
    const{comment_id}=req.params;
    console.log(req.params)

    removeComment(comment_id).then(()=>{
        res.status(204).send();
    }).catch(next)
}