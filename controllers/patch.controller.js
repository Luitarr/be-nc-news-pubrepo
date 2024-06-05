const {selectArticleVote}=require('../models/patch.model')

exports.patchArticleVote=(req, res,next) => {
    const { article_id } = req.params;
    const { inc_votes}=req.body;
    selectArticleVote(inc_votes,article_id)
    .then((article)=>{
        res.status(200).send({article})
    }).catch(next)
}