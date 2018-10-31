const { titreGet } = require('../../postgres/queries/titres')
const { titreDemarcheGet } = require('../../postgres/queries/titres-demarches')
const { titreStatutIdUpdate } = require('../titres')

const titreStatutIdFind = require('../_utils/titre-statut-id-find')

const titreStatutUpdate = async titreDemarcheId => {
  const titreDemarche = await titreDemarcheGet(titreDemarcheId)
  const titre = await titreGet(titreDemarche.titreId)

  const statutId = titreStatutIdFind(titre)
  const titreUpdated = titreStatutIdUpdate(titre, statutId)

  if (titreUpdated) {
    await titreUpdated
  }

  return `Mise à jour: ${titreUpdated ? '1' : '0'} statuts de titres.`
}

module.exports = titreStatutUpdate
