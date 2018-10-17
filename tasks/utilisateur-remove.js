require('dotenv').config()
require('../postgres')
const { utilisateurRemove } = require('../postgres/queries/utilisateurs')

const id = process.env.ADMIN_ID

const run = async () => {
  await utilisateurRemove(id)
  console.log('Utilisateur supprimé')
  process.exit()
}

run()
