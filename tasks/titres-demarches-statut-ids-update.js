const {
  titresDemarches,
  titreDemarcheStatutIdUpdate
} = require('../postgres/queries/titres-demarches')

const titreDemarcheStatutIdFind = require('./_utils/titre-demarche-statut-id-find')

// met à jour le statut des démarches
const titresDemarchesStatutUpdate = async () => {
  const tds = await titresDemarches({})

  // filtre uniquement les démarches dont le statut a changé
  const tdsModified = tds.filter(
    td => titreDemarcheStatutIdFind(td) !== td.demarcheStatutId
  )

  const tdsUpdated = await Promise.all([
    ...tdsModified.map(async td => {
      const demarcheStatutId = titreDemarcheStatutIdFind(td)
      const titreDemarche = await titreDemarcheStatutIdUpdate({
        id: td.id,
        demarcheStatutId
      })
      console.log(
        `Mise à jour: démarche ${td.id}, statutId ${demarcheStatutId}`
      )
      return titreDemarche
    })
  ])

  console.log(
    `Mise à jour: statuts de ${tdsModified.length} démarches de titres.`
  )
  return tdsUpdated
}

module.exports = titresDemarchesStatutUpdate
