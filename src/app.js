const express = require('express')
const cors = require('cors')
const format = require('pg-format')
const { canBe, capitalize } = require('./utils')
const { db, client } = require('./db')

const app = express()

app.use(cors())

app.get('/pokedex', (req, res) => {
  let { column, orderBy, offset, limit, query = '', types } = req.query

  db.then(async () => {
    const hasID = 'id' in req.query

    if (hasID) {
      const result = await client.query('select * from pokemon where id = $1', [
        req.query.id,
      ])
      res.send(result.rows)
      return
    }

    try {
      types = types.split(',').map(type => `'${capitalize(type)}'`)
    } catch {
      types = null
    }

    const typesQueryText = types ? `and types @> ARRAY[${types.join()}]` : ''

    const isAll = 'all' in req.query

    const offsetQueryText = !isAll ? 'OFFSET $2 limit $3' : ''

    column = canBe(column, ['id', 'name'])
    orderBy = canBe(orderBy, ['asc', 'desc'])

    const sql = format(
      `select * from pokemon where name ilike $1 ${typesQueryText} order by %s %s ${offsetQueryText}`,
      column,
      orderBy
    )

    if (isAll) {
      const results = await client.query(sql, [`${query}%`])
      res.send({ data: results.rows, count: results.rowCount })
      return
    }

    if (isNaN(+offset)) offset = 0
    if (isNaN(+limit)) limit = 5

    const { rows: countData } = await client.query(
      `select count(*) from pokemon where name ilike $1 ${typesQueryText}`,
      [`${query}%`]
    )
    const { rows: data } = await client.query(sql, [`${query}%`, offset, limit])
    res.send({ data, count: countData[0].count })
  }).catch(err => {
    console.log(err)
    res.send({ error: 'invalid query' })
  })
})

app.get('/pokedex/types', async (req, res) => {
  const { rows } = await client.query('select * from types')
  res.send({ data: rows[0].type, count: rows[0].type.length })
})

app.listen(process.env.PORT)
