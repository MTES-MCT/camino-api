const Knex = require('knex')
const config = require('./config-api')
const knex = Knex(config.knex)

const emailRegex = require('email-regex')
const bcrypt = require('bcrypt')

const password = process.env.ADMIN_PASSWORD

const utilisateur = {
  id: 'admin',
  email: process.env.ADMIN_EMAIL,
  permissionId: 'super'
}

const run = async () => {
  const errors = []

  if (!utilisateur.email) {
    errors.push('email manquant')
  } else if (!emailRegex({ exact: true }).test(utilisateur.email)) {
    errors.push('adresse email invalide')
  }

  if (!password) {
    errors.push('mot de passe manquant')
  } else if (password.length < 8) {
    errors.push('le mot de passe doit contenir au moins 8 caractères')
  }

  if (!errors.length) {
    utilisateur.motDePasse = await bcrypt.hash(password, 10)
    await knex('utilisateurs').insert(utilisateur)
    console.log('Utilisateur créé')
  } else {
    console.log('Aucun utilisateur créé:', errors.join(', '))
  }

  process.exit()
}

run()
