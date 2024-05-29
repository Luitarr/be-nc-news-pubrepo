const db = require('../db/connection')
const fs = require('fs')


exports.selectTopics=()=>{
    return db.query('SELECT * FROM topics;')
    .then(({rows})=>{
        console.log(rows)
        return rows
    })
}