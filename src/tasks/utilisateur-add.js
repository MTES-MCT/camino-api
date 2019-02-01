import 'dotenv/config'
import '../../database/index'
import * as bcrypt from 'bcrypt'

import { utilisateurAdd } from '../database/queries/utilisateurs'

const password = process.env.ADMIN_PASSWORD

const utilisateur = {
  id: process.env.ADMIN_ID,
  email: process.env.ADMIN_EMAIL,
  permissionId: 'super'
}

const run = async () => {
  utilisateur.motDePasse = await bcrypt.hash(password, 10)
  await utilisateurAdd(utilisateur)
  console.log('Utilisateur créé')
  process.exit()
}

run()
