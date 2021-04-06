const Knex = require('knex')
const { knexConfig } = require('./config')
const userAdd = require('./user-add')

const knex = Knex(knexConfig)

const run = async () => {
  const user = {
    id: 'admin',
    email: process.env.ADMIN_EMAIL,
    permissionId: 'super',
    motDePasse: process.env.ADMIN_PASSWORD
  }

  try {
    await userAdd(knex, user)
  } catch (e) {
    console.error(e)
  } finally {
    process.exit(0)
  }
}

run()
