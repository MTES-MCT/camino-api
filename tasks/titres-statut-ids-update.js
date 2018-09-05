const { titres, titreStatutIdUpdate } = require('../postgres/queries/titres')

const titreStatutIdFind = require('./_utils/titre-statut-id-find')

const titresStatutIdsUpdate = async () => {
  const ts = await titres({})
  const tsModified = ts.filter(t => titreStatutIdFind(t) !== t.statutId)

  const update = await Promise.all([
    ...tsModified.map(async t => {
      const statutId = titreStatutIdFind(t)
      const titre = await titreStatutIdUpdate({
        id: t.id,
        statutId
      })
      console.log(`Mise à jour: titre ${t.id}, statutId ${statutId}`)

      return titre
    })
  ])

  console.log(`Mise à jour: statutId de ${tsModified.length} titres.`)

  return update
}

module.exports = titresStatutIdsUpdate
