const { titresGet, titreUpdate } = require('../postgres/queries/titres')
const titrePropEtapeIdFind = require('./_utils/titre-prop-etape-id-find')

const props = [
  'points',
  'titulaires',
  'amodiataires',
  'administrations',
  'surface',
  'volume',
  'substances'
]

const titresPropsEtapeIdsUpdate = async () => {
  const titres = await titresGet({})
  const titreUpdateRequests = titres.reduce((arr, titre) => {
    const titrePropsUpdateRequests = props.reduce((res, prop) => {
      const propEtapeIdName = `${prop}TitreEtapeId`
      const etapeId = titrePropEtapeIdFind(titre.demarches, prop)

      if (etapeId !== titre[propEtapeIdName]) {
        const titreUpdateRequest = titreUpdate({
          id: titre.id,
          props: { [propEtapeIdName]: etapeId }
        }).then(u => {
          console.log(`Mise à jour: titre ${titre.id}, ${prop}, ${etapeId}`)
          return u
        })

        res = [...res, titreUpdateRequest]
      }

      return res
    }, [])

    return [...arr, ...titrePropsUpdateRequests]
  }, [])

  await Promise.all([...titreUpdateRequests])

  return `Mise à jour: ${titreUpdateRequests.length} propriétés de titres.`
}

module.exports = titresPropsEtapeIdsUpdate
