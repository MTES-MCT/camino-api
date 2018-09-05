const { titres, titreStatutIdUpdate } = require('../postgres/queries/titres')

const titreStatutIdFind = require('./_utils/titre-statut-id-find')

const titresStatutIdsUpdate = async () => {
  const ts = await titres({})

  const update = Promise.all([
    ...ts.map(td =>
      titreStatutIdUpdate({
        id: td.id,
        demarcheStatutId: titreStatutIdFind(td)
      })
    )
  ])

  console.log('Mise à jour: statuts de tous les titres.')

  return update
}

module.exports = titresStatutIdsUpdate
