import { titreUpdate, titreIdUpdate } from '../../database/queries/titres'

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

const titrePropsUpdate = async (titreId, props) => {
  await titreUpdate(titreId, props)

  return `Mise à jour: titre ${titreId} props: ${JSON.stringify(props)}`
}

const titreIdsUpdate = async (titreOldId, titreNew) => {
  await titreIdUpdate(titreOldId, titreNew)

  return `Mise à jour: titre ids: ${titreNew.id}`
}

export { titrePropsEtapes, titrePropsUpdate, titreIdsUpdate }
