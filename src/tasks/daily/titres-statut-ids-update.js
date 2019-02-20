import { titreStatutIdUpdate } from '../titres'

import titreStatutIdFind from '../_utils/titre-statut-id-find'

const titresStatutIdsUpdate = async titres => {
  const titresUpdated = titres
    .reduce((arr, titre) => {
      const statutId = titreStatutIdFind(titre)
      const titreUpdated = titreStatutIdUpdate(titre, statutId)

      return titreUpdated ? [...arr, titreUpdated] : arr
    }, [])
    .map(q => q.then(log => console.log(log)))

  await Promise.all(titresUpdated)

  return `Mise à jour: ${titresUpdated.length} statuts de titres.`
}
export default titresStatutIdsUpdate
