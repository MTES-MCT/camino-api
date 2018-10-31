const { titreStatutIdUpdate } = require('../titres')

const titreStatutIdFind = require('../_utils/titre-statut-id-find')

const titresStatutIdsUpdate = async titres => {
  const titresUpdated = titres.reduce((arr, titre) => {
    const statutId = titreStatutIdFind(titre)
    const titreUpdated = titreStatutIdUpdate(titre, statutId)

    return titreUpdated ? [...arr, titreUpdated] : arr
  }, [])

  await Promise.all(titresUpdated)

  return `Mise à jour: ${titresUpdated.length} statuts de titres.`
}
module.exports = titresStatutIdsUpdate
