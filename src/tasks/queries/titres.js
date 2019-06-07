import {
  titrePropsUpdate as titrePropsUpdateQuery,
  titreIdUpdate as titreIdUpdateQuery
} from '../../database/queries/titres'

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

const titrePropUpdate = (titre, prop, value) =>
  value !== titre[prop] &&
  titrePropsUpdateQuery({
    id: titre.id,
    props: { [prop]: value }
  }).then(u => `Mise à jour: titre ${titre.id}, ${prop}, ${value}`)

const titreIdsUpdate = (titreOldId, titreNew) =>
  titreIdUpdateQuery(titreOldId, titreNew).then(
    u => `Mise à jour: titre ids: ${titreNew.id}`
  )

export { calculatedProps, titreStatutIdUpdate, titrePropUpdate, titreIdsUpdate }
