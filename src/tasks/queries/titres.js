import {
  titrePropsUpdate as titrePropsUpdateQuery,
  titreIdUpdate as titreIdUpdateQuery
} from '../../database/queries/titres'
import titrePropEtapeIdFind from '../rules/titre-prop-etape-id-find'

const calculatedProps = [
  'points',
  'titulaires',
  'amodiataires',
  'administrations',
  'surface',
  'volume',
  'volumeUniteId',
  'substances',
  'communes',
  'engagement',
  'engagementDeviseId'
]

const titreStatutIdUpdate = (titre, statutId) =>
  statutId !== titre.statutId &&
  titrePropsUpdateQuery({
    id: titre.id,
    props: { statutId }
  }).then(u => `Mise à jour: titre ${titre.id}, statutId ${statutId}`)

const titrePropsUpdate = (titre, prop) => {
  const propEtapeIdName = `${prop}TitreEtapeId`
  const etapeId = titrePropEtapeIdFind(titre.demarches, prop)

  return (
    etapeId !== titre[propEtapeIdName] &&
    titrePropsUpdateQuery({
      id: titre.id,
      props: { [propEtapeIdName]: etapeId }
    }).then(u => `Mise à jour: titre ${titre.id}, ${prop}, ${etapeId}`)
  )
}

const titreIdUpdate = (titreOldId, titreNew) =>
  (titreNew.id !== titreOldId && console.log(JSON.stringify(titreNew))) ||
  titreIdUpdateQuery(titreOldId, titreNew)

export { calculatedProps, titreStatutIdUpdate, titrePropsUpdate, titreIdUpdate }
