import * as dateFormat from 'dateformat'

import { titrePatch, titreIdUpdate } from '../../database/queries/titres'

const titrePropsEtapes = [
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
  titrePatch({
    id: titre.id,
    props: { statutId }
  }).then(u => `Mise à jour: titre ${titre.id}, statutId ${statutId}`)

const titrePropUpdate = (titre, prop, value) => {
  const valueOld =
    titre[prop] instanceof Date
      ? dateFormat(titre[prop], 'yyyy-mm-dd')
      : titre[prop]

  return (
    value !== valueOld &&
    titrePatch({
      id: titre.id,
      props: { [prop]: value }
    }).then(u => `Mise à jour: titre ${titre.id}, ${prop}, ${value}`)
  )
}

const titreIdsUpdate = (titreOldId, titreNew) =>
  titreIdUpdate(titreOldId, titreNew).then(
    u => `Mise à jour: titre ids: ${titreNew.id}`
  )

export {
  titrePropsEtapes,
  titreStatutIdUpdate,
  titrePropUpdate,
  titreIdsUpdate
}
