import { titreUpdate, titreIdUpdate } from '../../database/queries/titres'

const titrePropsUpdate = async (titreId, props) => {
  await titreUpdate(titreId, props)

  return `Mise à jour: titre ${titreId} props: ${JSON.stringify(props)}`
}

const titreIdsUpdate = async (titreOldId, titreNew) => {
  await titreIdUpdate(titreOldId, titreNew)

  return `Mise à jour: titre ids: ${titreNew.id}`
}

export { titrePropsUpdate, titreIdsUpdate }
