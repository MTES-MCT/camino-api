const { titrePropsUpdate, calculatedProps } = require('../titres')

const titresPropsEtapeIdsUpdate = async titre => {
  const titrePropsUpdateRequests = calculatedProps.reduce((res, prop) => {
    const titrePropsUpdated = titrePropsUpdate(titre, prop)

    return titrePropsUpdated ? [...res, titrePropsUpdated] : res
  }, [])

  await Promise.all(titrePropsUpdateRequests)

  return `Mise à jour: ${titrePropsUpdateRequests.length} propriétés de titres.`
}

module.exports = titresPropsEtapeIdsUpdate
