import 'dotenv/config'
import '../../../database/index'

import { utilisateurDelete } from '../../../database/queries/utilisateurs'

const id = 'admin'

const run = async () => {
  const utilisateur = await utilisateurDelete(id)
  if (utilisateur) {
    console.log('Utilisateur supprimé')
  } else {
    console.log('Aucun utilisateur supprimé')
  }
  process.exit()
}

run()
