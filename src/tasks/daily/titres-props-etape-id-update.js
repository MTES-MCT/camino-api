const { titrePropsUpdate, calculatedProps } = require('../titres')

const titresPropsEtapeIdsUpdate = async titres => {
  const titreUpdateRequests = titres.reduce((arr, titre) => {
    const titrePropsUpdateRequests = calculatedProps.reduce((res, prop) => {
      const titrePropsUpdated = titrePropsUpdate(titre, prop)

      return titrePropsUpdated ? [...res, titrePropsUpdated] : res
    }, [])

    return [...arr, ...titrePropsUpdateRequests]
  }, [])

  await Promise.all(titreUpdateRequests)

  return `Mise à jour: ${titreUpdateRequests.length} propriétés de titres.`
}

module.exports = titresPropsEtapeIdsUpdate
