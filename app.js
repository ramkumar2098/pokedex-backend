const express = require('express')
const { Client } = require('pg')
const cors = require('cors')

const app = express()

const client = new Client({
  user: 'ramkumar2098',
  password: 'test',
  database: 'pokedex',
})

const db = client.connect()

app.use(cors())

const canBe = (variable, possibleValues) =>
  possibleValues.includes(variable) ? variable : possibleValues[0]

app.get('/pokedex', (req, res) => {
  let { column, orderBy, offset, limit, query } = req.query

  column = canBe(column, ['id', 'name'])
  orderBy = canBe(orderBy, ['asc', 'desc'])

  const isAll = 'all' in req.query

  db.then(() => {
    const filterQueryText = query ? `WHERE name ILIKE '${query}%'` : ''
    let queryText
    if (isAll) {
      queryText = `select * from pokemon ${filterQueryText} order by ${column} ${orderBy}`
    } else {
      if (isNaN(+offset)) offset = 0
      if (isNaN(+limit)) limit = 5
      queryText = `select count(*) from pokemon ${filterQueryText}; select * from pokemon ${filterQueryText} order by ${column} ${orderBy} OFFSET ${offset} limit ${limit}`
    }
    return client.query(queryText)
  })
    .then(results => {
      if (isAll) {
        res.send({ data: results.rows, count: results.rowCount })
      } else {
        res.send({ data: results[1].rows, count: results[0].rows[0].count })
      }
    })
    .catch(console.log)
})

app.listen(8080)
