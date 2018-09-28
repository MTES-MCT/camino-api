require('dotenv').config()
require('../postgres')
const { utilisateurRemove } = require('../postgres/queries/utilisateurs')

const group = {
  id: 'admin',
  role: 'admin'
}

const id = process.env.ADMIN_ID

const run = async () => {
  await utilisateurRemove(id, group)
  console.log('Utilisateur supprimé')
  process.exit()
}

run()
