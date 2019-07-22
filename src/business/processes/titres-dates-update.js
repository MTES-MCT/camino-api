import * as dateFormat from 'dateformat'
import { titrePropsUpdate } from '../queries/titres'
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

    return Object.keys(props).length
      ? [
          ...acc,
          // async () => console.log(await titrePropsUpdate(titre.id, props))
          () => titrePropsUpdate(titre.id, props).then(console.log)
        ]
      : acc
  }, [])

  if (titresDatesUpdateRequests.length) {
    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titresDatesUpdateRequests)
  }

  return `Mise à jour: propriétés (dates) de ${titresDatesUpdateRequests.length} titre(s).`
}

export default titresDatesUpdate
