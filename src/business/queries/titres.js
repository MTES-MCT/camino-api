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

const titrePropsUpdate = async (titre, props) => {
  await titreUpdate(titre.id, props)

  return `Mise à jour: titre ${titre.id} props: ${JSON.stringify(props)}`
}

const titreIdsUpdate = (titreOldId, titreNew) =>
  titreIdUpdate(titreOldId, titreNew).then(
    u => `Mise à jour: titre ids: ${titreNew.id}`
  )

export { titrePropsEtapes, titrePropsUpdate, titreIdsUpdate }
