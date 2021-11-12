const express = require('express')
const { Client } = require('pg')
const cors = require('cors')
const format = require('pg-format')

const app = express()

const client = new Client({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  port: process.env.PSQL_PORT,
  password: process.env.PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
})

const db = client.connect()

app.use(cors())

const canBe = (variable, possibleValues) =>
  possibleValues.includes(variable) ? variable : possibleValues[0]

app.get('/pokedex', (req, res) => {
  let { column, orderBy, offset, limit, query = '' } = req.query

  column = canBe(column, ['id', 'name'])
  orderBy = canBe(orderBy, ['asc', 'desc'])

  const isAll = 'all' in req.query
  const hasID = 'id' in req.query

  db.then(async () => {
    if (hasID) {
      const result = await client.query('select * from pokemon where id = $1', [
        req.query.id,
      ])
      res.send(result.rows)
      return
    }
    if (isAll) {
      const sql = format(
        'select * from pokemon where name ilike $1 order by %s %s',
        column,
        orderBy
      )
      const results = await client.query(sql, [`${query}%`])
      res.send({ data: results.rows, count: results.rowCount })
    } else {
      if (isNaN(+offset)) offset = 0
      if (isNaN(+limit)) limit = 5
      const sql = format(
        'select * from pokemon where name ilike $1 order by %s %s OFFSET $2 limit $3',
        column,
        orderBy
      )
      const { rows: countData } = await client.query(
        'select count(*) from pokemon where name ilike $1',
        [`${query}%`]
      )
      const { rows: data } = await client.query(sql, [
        `${query}%`,
        offset,
        limit,
      ])
      res.send({ data, count: countData[0].count })
    }
  }).catch(err => {
    console.log(err)
    res.send({ error: 'invalid query' })
  })
})

app.listen(process.env.PORT)
