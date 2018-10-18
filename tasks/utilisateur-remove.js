require('dotenv').config()
require('../postgres')
const { utilisateurRemove } = require('../postgres/queries/utilisateurs')

const id = process.env.ADMIN_ID

const run = async () => {
  const utilisateur = await utilisateurRemove(id)
  if (utilisateur) {
    console.log('Utilisateur supprimé')
  } else {
    console.log('Aucun utilisateur supprimé')
  }
  process.exit()
}

run()
