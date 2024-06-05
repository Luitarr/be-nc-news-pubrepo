const db= require('../db/connection')

exports.selectArticleVote=(inc_votes,article_id)=>{
    if(typeof inc_votes !== 'number'){
        return Promise.reject({status:400, msg:"bad request"})
    }
    return db.query(`UPDATE articles SET votes = votes +$1 
    WHERE article_id = $2 RETURNING title, topic, author, body, created_at, votes, article_img_url;`,
[inc_votes, article_id])
.then(({rows})=>{
    console.log(rows)
    if (rows.length === 0){
        return Promise.reject({status: 404, msg:"not found"})
    }
    return rows[0]
})

}