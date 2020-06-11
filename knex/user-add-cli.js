const Knex = require('knex')
const configDbManager = require('./config-db-manager')
const userAdd = require('./user-add')

const run = async knex => {
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

const knex = Knex(configDbManager.knex)

run(knex)
