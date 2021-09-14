const emailRegex = require('email-regex')
const bcrypt = require('bcryptjs')

const userAdd = async (knex, user) => {
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

module.exports = userAdd
