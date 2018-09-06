const {
  titresDemarchesGet,
  titreDemarcheStatutIdUpdate
} = require('../postgres/queries/titres-demarches')

const titreDemarcheStatutIdFind = require('./_utils/titre-demarche-statut-id-find')

// met à jour le statut des démarches
const titresDemarchesStatutUpdate = async () => {
  const titresDemarches = await titresDemarchesGet({})

  const titresDemarchesUpdate = titresDemarches.reduce((arr, titreDemarche) => {
    const demarcheStatutId = titreDemarcheStatutIdFind(titreDemarche)

    // filtre uniquement les démarches dont le statut a changé
    if (demarcheStatutId !== titreDemarche.demarcheStatutId) {
      const titreDemarcheUpdate = titreDemarcheStatutIdUpdate({
        id: titreDemarche.id,
        demarcheStatutId
      }).then(u => {
        console.log(
          `Mise à jour: démarche ${
            titreDemarche.id
          }, statutId ${demarcheStatutId}`
        )
        return u
      })

      arr = [...arr, titreDemarcheUpdate]
    }

    return arr
  }, [])

  const titresDemarchesUpdated = await Promise.all([...titresDemarchesUpdate])

  console.log(
    `Mise à jour: statuts de ${
      titresDemarchesUpdate.length
    } démarches de titres.`
  )
  return titresDemarchesUpdated
}

module.exports = titresDemarchesStatutUpdate
