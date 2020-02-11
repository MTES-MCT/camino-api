import { ITitres } from '../../types'

import { titreUpdate } from '../../database/queries/titres'
import titreDateFinFind from '../rules/titre-date-fin-find'
import titreDateDebutFind from '../rules/titre-date-debut-find'
import titreDateDemandeFind from '../rules/titre-date-demande-find'
import PQueue from 'p-queue'

const titresDatesUpdate = async (titres: ITitres[]) => {
  const queue = new PQueue({ concurrency: 100 })

  const titresUpdated = titres.reduce((titresUpdated: string[], titre) => {
    const props: any = {}

    const dateFin = titreDateFinFind(titre.demarches)

    if (titre.dateFin !== dateFin) {
      props.dateFin = dateFin
    }

    const dateDebut = titreDateDebutFind(titre.demarches, titre.typeId)

    if (titre.dateDebut !== dateDebut) {
      props.dateDebut = dateDebut
    }

    const dateDemande = titreDateDemandeFind(titre.demarches, titre.statutId)

    if (titre.dateDemande !== dateDemande) {
      props.dateDemande = dateDemande
    }

    if (Object.keys(props).length) {
      queue.add(async () => {
        await titreUpdate(titre.id, props)

        console.log(
          `mise à jour: titre ${titre.id} props: ${JSON.stringify(props)}`
        )

        titresUpdated.push(titre.id)
      })
    }

    return titresUpdated
  }, [])

  await queue.onIdle()

  return titresUpdated
}

export default titresDatesUpdate
