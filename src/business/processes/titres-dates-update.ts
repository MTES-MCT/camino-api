import { ITitre } from '../../types'
import { titresGet, titreUpdate } from '../../database/queries/titres'
import titreDateFinFind from '../rules/titre-date-fin-find'
import titreDateDebutFind from '../rules/titre-date-debut-find'
import titreDateDemandeFind from '../rules/titre-date-demande-find'
import PQueue from 'p-queue'

const titresDatesUpdate = async (titresIds?: string[]) => {
  console.info('date de début, de fin et de demande initiale des titres…')

  const queue = new PQueue({ concurrency: 100 })
  const titres = await titresGet(
    { ids: titresIds },
    {
      fields: {
        demarches: { phase: { id: {} }, etapes: { points: { id: {} } } }
      }
    },
    'super'
  )

  const titresUpdated = [] as string[]

  titres.forEach(titre => {
    const props: Partial<ITitre> = {}

    const dateFin = titreDateFinFind(titre.demarches!)

    if (titre.dateFin !== dateFin) {
      props.dateFin = dateFin
    }

    const dateDebut = titreDateDebutFind(titre.demarches!, titre.typeId)

    if (titre.dateDebut !== dateDebut) {
      props.dateDebut = dateDebut
    }

    const dateDemande = titreDateDemandeFind(titre.demarches!, titre.statutId!)

    if (titre.dateDemande !== dateDemande) {
      props.dateDemande = dateDemande
    }

    if (Object.keys(props).length) {
      queue.add(async () => {
        await titreUpdate(titre.id, props)

        console.info(
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
