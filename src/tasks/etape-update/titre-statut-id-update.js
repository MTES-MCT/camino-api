import { titreStatutIdUpdate } from '../titres'

import titreStatutIdFind from '../_utils/titre-statut-id-find'

const titreStatutUpdate = async titre => {
  const statutId = titreStatutIdFind(titre)
  const titreUpdated = titreStatutIdUpdate(titre, statutId)

  if (titreUpdated) {
    await titreUpdated
  }

  return `Mise à jour: ${titreUpdated ? '1' : '0'} statuts de titres.`
}

export default titreStatutUpdate
