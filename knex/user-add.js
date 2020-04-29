const Knex = require('knex')
const configDbManager = require('./config-db-manager')
const knex = Knex(configDbManager.knex)

const emailRegex = require('email-regex')
const bcrypt = require('bcryptjs')

const userAdd = async user => {
  const errors = []

  if (!user.email) {
    errors.push('email manquant')
  } else if (!emailRegex({ exact: true }).test(user.email)) {
    errors.push('adresse email invalide')
  }

  if (!user.motDePasse) {
    errors.push('mot de passe manquant')
  } else if (user.motDePasse.length < 8) {
    errors.push('le mot de passe doit contenir au moins 8 caractères')
  }

  if (!errors.length) {
    user.motDePasse = bcrypt.hashSync(user.motDePasse, 10)

    await knex('utilisateurs').insert(user)

    console.info('Utilisateur créé')
  } else {
    console.info('Aucun user créé:', errors.join(', '))
  }
}

const run = async () => {
  const user = {
    id: 'admin',
    email: process.env.ADMIN_EMAIL,
    permissionId: 'super',
    motDePasse: process.env.ADMIN_PASSWORD
  }

  try {
    await userAdd(user)

    // arrête le script proprement s'il est appelé directement
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(0)
  }
}

if (!module.parent) {
  run()
}

module.exports = userAdd
