/*
 Script de ré-écriture des ids utilisateurs
 ancien : robert-dupont
 nouveau : ab1d3f
 */

const { readFileSync: read, writeFileSync: write } = require('fs')

const cryptoRandomString = require('crypto-random-string')

const utilisateurs = JSON.parse(read('./sources/utilisateurs.json'))
const utilisateursIndex = utilisateurs.reduce((index, utilisateur) => {
  index[utilisateur.id] = utilisateur

  return index
}, {})

const activites = JSON.parse(read('./sources/titres-activites.json'))

const entreprises = JSON.parse(read('./sources/utilisateurs--entreprises.json'))

utilisateurs.forEach(utilisateur => {
  if (utilisateur.id.length === 6) return

  const id = cryptoRandomString({ length: 6 })

  utilisateur.id = id
})

activites.forEach(activite => {
  if (!activite.utilisateur_id) return

  const u = utilisateursIndex[activite.utilisateur_id]

  activite.utilisateur_id = u.id
})

entreprises.forEach(entreprise => {
  entreprise.utilisateur_id = utilisateursIndex[entreprise.utilisateur_id].id
})

write('sources/utilisateurs.json', JSON.stringify(utilisateurs, null, 2))
write('sources/titres-activites.json', JSON.stringify(activites, null, 2))
write(
  'sources/utilisateurs--entreprises.json',
  JSON.stringify(entreprises, null, 2)
)
