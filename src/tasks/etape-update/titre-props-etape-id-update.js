import { titrePropsUpdate, calculatedProps } from '../titres'

const titresPropsEtapeIdsUpdate = async titre => {
  const titrePropsUpdateRequests = calculatedProps.reduce((res, prop) => {
    const titrePropsUpdated = titrePropsUpdate(titre, prop)

    return titrePropsUpdated ? [...res, titrePropsUpdated] : res
  }, [])

  if (titrePropsUpdateRequests && titrePropsUpdateRequests.length) {
    const titrePropsUpdateQueries = titrePropsUpdateRequests.map(q =>
      q.then(log => console.log(log))
    )
    await Promise.all(titrePropsUpdateQueries)
  }

  return `Mise à jour: ${titrePropsUpdateRequests.length} propriétés de titres.`
}

export default titresPropsEtapeIdsUpdate
