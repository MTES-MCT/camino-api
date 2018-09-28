require('dotenv').config()
const bcrypt = require('bcrypt')
require('../postgres')
const { utilisateurAdd } = require('../postgres/queries/utilisateurs')

const group = {
  id: 'admin',
  role: 'admin'
}

const utilisateur = {
  id: process.env.ADMIN_ID,
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  groupes: ['superadmin']
}

const run = async () => {
  utilisateur.password = await bcrypt.hash(utilisateur.password, 10)
  await utilisateurAdd(utilisateur, group)
  console.log('Utilisateur créé')
  process.exit()
}

run()
