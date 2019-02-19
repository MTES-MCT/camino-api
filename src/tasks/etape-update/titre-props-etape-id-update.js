import { titrePropsUpdate, calculatedProps } from '../titres'

const titresPropsEtapeIdsUpdate = async titre => {
  const titrePropsUpdateRequests = calculatedProps.reduce((res, prop) => {
    const titrePropsUpdated = titrePropsUpdate(titre, prop)

    return titrePropsUpdated ? [...res, titrePropsUpdated] : res
  }, [])

  if (titrePropsUpdateRequests && titrePropsUpdateRequests.length) {
    await Promise.all(titrePropsUpdateRequests)
  }

  return `Mise à jour: ${titrePropsUpdateRequests.length} propriétés de titres.`
}

export default titresPropsEtapeIdsUpdate
