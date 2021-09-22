import '../init'
import { knex } from '../knex'
const userAdd = require('./user-add')

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
