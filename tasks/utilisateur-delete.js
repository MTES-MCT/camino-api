require('dotenv').config()
require('../postgres')
const { utilisateurSupprimer } = require('../postgres/queries/utilisateurs')

const group = {
  id: 'admin',
  role: 'admin'
}

const id = process.env.ADMIN_ID

const run = async () => {
  await utilisateurSupprimer(id, group)
  console.log('Utilisateur supprimé')
  process.exit()
}

run()
