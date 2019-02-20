import { titreDemarcheStatutIdUpdate } from '../titre-demarches'
import titreDemarcheStatutIdFind from '../_utils/titre-demarche-statut-id-find'

// met à jour le statut des démarches
const titresDemarcheStatutIdUpdate = async (titreDemarche, titreTypeId) => {
  const statutId = titreDemarcheStatutIdFind(titreDemarche, titreTypeId)

  const titreDemarcheUpdated = titreDemarcheStatutIdUpdate(
    titreDemarche,
    statutId
  )

  if (titreDemarcheUpdated) {
    const titreDemarcheUpdateQuery = titreDemarcheUpdated.then(log =>
      console.log(log)
    )
    await titreDemarcheUpdateQuery
  }

  return `Mise à jour: ${titreDemarcheUpdated ? '1' : '0'} statut de démarche.`
}

export default titresDemarcheStatutIdUpdate
