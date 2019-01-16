require('dotenv').config()
require('../database/index')

const { utilisateurRemove } = require('../database/queries/utilisateurs')

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
