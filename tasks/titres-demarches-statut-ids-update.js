const {
  titresDemarchesGet,
  titreDemarcheStatutIdUpdate
} = require('../postgres/queries/titres-demarches')

const { titresGet } = require('../postgres/queries/titres')

const titreDemarcheStatutIdFind = require('./_utils/titre-demarche-statut-id-find')

// met à jour le statut des démarches
const titresDemarchesStatutUpdate = async () => {
  const titresDemarches = await titresDemarchesGet({})
  const titres = await titresGet({})

  const titresDemarchesUpdated = titresDemarches.reduce(
    (arr, titreDemarche) => {
      const titreIsAxm = titres.find(t => t.id === titreDemarche.titreId).typeId
      const statutId = titreDemarcheStatutIdFind(titreDemarche, titreIsAxm)

      // filtre uniquement les démarches dont le statut a changé
      if (statutId !== titreDemarche.statutId) {
        const titreDemarcheUpdate = titreDemarcheStatutIdUpdate({
          id: titreDemarche.id,
          statutId
        }).then(u => {
          console.log(
            `Mise à jour: démarche ${titreDemarche.id}, statutId ${statutId}`
          )
          return u
        })

        arr = [...arr, titreDemarcheUpdate]
      }

      return arr
    },
    []
  )

  await Promise.all([...titresDemarchesUpdated])

  return `Mise à jour: ${titresDemarchesUpdated.length} statuts de démarches.`
}

module.exports = titresDemarchesStatutUpdate
