import { titrePropsUpdate, calculatedProps } from '../titres'

const titresPropsEtapeIdsUpdate = async titres => {
  const titreUpdateRequests = titres.reduce((arr, titre) => {
    const titrePropsUpdateRequests = calculatedProps.reduce((res, prop) => {
      const titrePropsUpdated = titrePropsUpdate(titre, prop)

      return titrePropsUpdated ? [...res, titrePropsUpdated] : res
    }, [])

    return [...arr, ...titrePropsUpdateRequests]
  }, [])

  if (titreUpdateRequests && titreUpdateRequests.length) {
    const titreUpdateQueries = titreUpdateRequests.map(q =>
      q.then(log => console.log(log))
    )
    await Promise.all(titreUpdateQueries)
  }

  return `Mise à jour: ${titreUpdateRequests.length} propriétés de titres.`
}

export default titresPropsEtapeIdsUpdate
