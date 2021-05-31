import { titreEtapeUpdate } from '../../database/queries/titres-etapes'
import { titreDemarcheGet } from '../../database/queries/titres-demarches'
import { userSuper } from '../../database/user-super'
import { dateAddDays } from '../../tools/date'

const titresEtapesDemandeACOUpdate = async (titresDemarchesId: string) => {
  console.info()
  console.info('date de la demande en construction…')

  const titresDemarche = await titreDemarcheGet(
    titresDemarchesId,
    {
      fields: {
        etapes: { id: {} }
      }
    },
    userSuper
  )

  const titresEtapesIdsUpdated = [] as string[]

  if (titresDemarche.etapes && titresDemarche.etapes.length > 1) {
    const etapeDemandeACO = titresDemarche.etapes?.find(
      e => e.typeId === 'mfr' && e.statutId === 'aco'
    )
    if (etapeDemandeACO) {
      const etapes = titresDemarche.etapes!.filter(
        te => te.id !== etapeDemandeACO.id
      )

      let date = etapes.map(te => te.date).sort()[etapes.length - 1]
      date = dateAddDays(date, 1)

      if (etapeDemandeACO.date < date) {
        await titreEtapeUpdate(etapeDemandeACO.id, { date })

        const log = {
          type: 'titre / démarche / étape : date (mise à jour) ->',
          value: `${etapeDemandeACO.id} : ${date}`
        }

        console.info(log.type, log.value)

        titresEtapesIdsUpdated.push(etapeDemandeACO.id)
      }
    }
  }

  return titresEtapesIdsUpdated
}

export { titresEtapesDemandeACOUpdate }
