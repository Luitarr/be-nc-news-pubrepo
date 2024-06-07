const db= require('../db/connection')

exports.removeComment=(comment_id)=>{
    if (isNaN(Number(comment_id))) {
        return Promise.reject({ status: 400, msg: 'bad request' });
    }

    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [comment_id])
        .then(({ rows }) => {
            console.log(rows)
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'comment not found' });
            }
        });
}