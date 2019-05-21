import titreIdUpdate from './titre-id-update'
import { titreIdUpdate as titreIdUpdateQuery } from '../queries/titres'

const titresIdsUpdate = async titresOld => {
  const titresNews = await titresOld.reduce(async (titresNews, titreOld) => {
    try {
      titresNews = await titresNews

      const titreNew = await titreIdUpdate(titreOld)

      return titreNew.id !== titreOld.id
        ? [...titresNews, titreNew]
        : titresNews
    } catch (e) {
      console.error(titreOld.id)
      console.error(e)

      return titresNews
    }
  }, [])

  return `Mise à jour: ${titresNews.length} id(s) de titres.`
}

export default titresIdsUpdate
