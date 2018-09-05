const {
  titresDemarches,
  titreDemarcheStatutIdUpdate
} = require('../postgres/queries/titres-demarches')

const titreDemarcheStatutIdFind = require('./_utils/titre-demarche-statut-id-find')

const titresDemarchesStatutUpdate = async () => {
  const tds = await titresDemarches({})

  const update = await Promise.all([
    ...tds.map(td =>
      titreDemarcheStatutIdUpdate({
        id: td.id,
        demarcheStatutId: titreDemarcheStatutIdFind(td)
      })
    )
  ])

  console.log('Mise à jour: statuts des démarches de tous les titres.')
  return update
}

module.exports = titresDemarchesStatutUpdate
