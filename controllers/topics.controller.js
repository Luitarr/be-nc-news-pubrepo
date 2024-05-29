const {selectTopics}=require('../models/topics.model')


exports.getTopic = (req,res,next)=>{
    console.log('hello')
    selectTopics().then((topics)=>{
        res.status(200).send({topics})
    })
    .catch((err)=>{
        next(err)
    })
}