import { titrePropUpdate, etapesProps } from '../queries/titres'
import titrePropEtapeIdFind from '../rules/titre-prop-etape-id-find'

const titresPropsEtapeIdsUpdate = async titres => {
  const titreUpdateRequests = titres.reduce((arr, titre) => {
    const titrePropsUpdateRequests = etapesProps.reduce((acc, prop) => {
      const propEtapeIdName = `${prop}TitreEtapeId`
      const etapeId = titrePropEtapeIdFind(titre.demarches, prop)

      const titrePropUpdated = titrePropUpdate(titre, propEtapeIdName, etapeId)

      return titrePropUpdated ? [...acc, titrePropUpdated] : acc
    }, [])

    return [...arr, ...titrePropsUpdateRequests]
  }, [])

  if (titreUpdateRequests.length) {
    const titreUpdateQueries = titreUpdateRequests.map(q =>
      q.then(log => console.log(log))
    )
    await Promise.all(titreUpdateQueries)
  }

  return `Mise à jour: ${titreUpdateRequests.length} propriétés (étapes) de titres.`
}

export default titresPropsEtapeIdsUpdate
