import { titreEtapeUpdate as queryTitreEtapeUpdate } from '../database/queries/titres-etapes'

const titreEtapesOrdreUpdate = titreEtapesByDemarche =>
  titreEtapesByDemarche
    .sort((a, b) => a.date - b.date)
    .map((titreEtape, index) => {
      titreEtape.ordreNew = index + 1
      return titreEtape
    })
    .filter(titreEtape => titreEtape.ordreNew !== titreEtape.ordre)
    .map(titreEtape => {
      const props = {
        ordre: titreEtape.ordreNew
      }

      queryTitreEtapeUpdate({ id: titreEtape.id, props }).then(u => {
        console.log(
          `Mise à jour: étape ${titreEtape.id}, ${JSON.stringify(props)}`
        )
        return u
      })
    })

export { titreEtapesOrdreUpdate }
