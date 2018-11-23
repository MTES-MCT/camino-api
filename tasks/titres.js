const { titrePropsUpdate } = require('../database/queries/titres')
const titrePropEtapeIdFind = require('./_utils/titre-prop-etape-id-find')

const titres = {
  calculatedProps: [
    'points',
    'titulaires',
    'amodiataires',
    'administrations',
    'surface',
    'volume',
    'substances'
  ],

  titreStatutIdUpdate(titre, statutId) {
    return (
      statutId !== titre.statutId &&
      titrePropsUpdate({
        id: titre.id,
        props: { statutId }
      }).then(u => {
        console.log(`Mise à jour: titre ${titre.id}, statutId ${statutId}`)
        return u
      })
    )
  },

  titrePropsUpdate(titre, prop) {
    const propEtapeIdName = `${prop}TitreEtapeId`
    const etapeId = titrePropEtapeIdFind(titre.demarches, prop)

    return (
      etapeId !== titre[propEtapeIdName] &&
      titrePropsUpdate({
        id: titre.id,
        props: { [propEtapeIdName]: etapeId }
      }).then(u => {
        console.log(`Mise à jour: titre ${titre.id}, ${prop}, ${etapeId}`)
        return u
      })
    )
  }
}

module.exports = titres
