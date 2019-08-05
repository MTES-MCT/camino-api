import * as dateFormat from 'dateformat'
import { titreUpdate } from '../../database/queries/titres'
import titreDateFinFind from '../rules/titre-date-fin-find'
import titreDateDebutFind from '../rules/titre-date-debut-find'
import titreDateDemandeFind from '../rules/titre-date-demande-find'
import PQueue from 'p-queue'

const datesDiffer = (dateOld, dateNew) =>
  (dateOld && dateFormat(dateOld, 'yyyy-mm-dd')) !== dateNew

const titresDatesUpdate = async titres => {
  const titresDatesUpdateRequests = titres.reduce((acc, titre) => {
    const props = {}

    const dateFin = titreDateFinFind(titre.demarches)

    if (datesDiffer(titre.dateFin, dateFin)) {
      props.dateFin = dateFin
    }

    const dateDebut = titreDateDebutFind(titre.demarches, titre.typeId)

    if (datesDiffer(titre.dateDebut, dateDebut)) {
      props.dateDebut = dateDebut
    }

    const dateDemande = titreDateDemandeFind(titre.demarches, titre.statutId)

    if (datesDiffer(titre.dateDemande, dateDemande)) {
      props.dateDemande = dateDemande
    }

    if (Object.keys(props).length) {
      acc.push(async () => {
        await titreUpdate(titre.id, props)
        console.log(
          `mise à jour: titre ${titre.id} props: ${JSON.stringify(props)}`
        )
      })
    }

    return acc
  }, [])

  if (titresDatesUpdateRequests.length) {
    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titresDatesUpdateRequests)
  }

  return `mise à jour: ${titresDatesUpdateRequests.length} titre(s) (propriétés-dates)`
}

export default titresDatesUpdate
