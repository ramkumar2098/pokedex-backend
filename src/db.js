const { Client } = require('pg')

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

module.exports = {
  db,
  client,
}
