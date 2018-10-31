const { titreGet } = require('../../postgres/queries/titres')
const { titreDemarcheGet } = require('../../postgres/queries/titres-demarches')
const { titrePropsUpdate, calculatedProps } = require('../titres')

const titresPropsEtapeIdsUpdate = async titreDemarcheId => {
  const titreDemarche = await titreDemarcheGet(titreDemarcheId)
  const titre = await titreGet(titreDemarche.titreId)

  const titrePropsUpdateRequests = calculatedProps.reduce((res, prop) => {
    const titrePropsUpdated = titrePropsUpdate(titre, prop)

    return titrePropsUpdated ? [...res, titrePropsUpdated] : res
  }, [])

  await Promise.all(titrePropsUpdateRequests)

  return `Mise à jour: ${titrePropsUpdateRequests.length} propriétés de titres.`
}

module.exports = titresPropsEtapeIdsUpdate
