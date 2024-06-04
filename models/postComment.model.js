const db= require('../db/connection')

exports.addComment = (article_id, author, body) => {
 
    if(!author || !body){
        return Promise.reject({status: 400, msg: "bad request"})
    }

    return db.query(`SELECT * FROM users WHERE username = $1;`, [author])// invalid author
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "username not found" });
            } else { return db.query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id]) }
        }).then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status: 404, msg:"not found"})
        } else{
            return db.query( `INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING author, body;`,  // here I was returning *
    [article_id, author, body]).then(({rows})=>{
      const comments= rows[0]
        return comments
    })
        }
    })
  
    

}