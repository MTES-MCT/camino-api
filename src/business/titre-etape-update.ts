import { IArea } from '../types'
import { titreDemarcheGet } from '../database/queries/titres-demarches'

import titresActivitesUpdate from './processes/titres-activites-update'
import titresDatesUpdate from './processes/titres-dates-update'
import titresDemarchesPublicUpdate from './processes/titres-demarches-public-update'
import titresDemarchesStatutIdUpdate from './processes/titres-demarches-statut-ids-update'
import titresDemarchesOrdreUpdate from './processes/titres-demarches-ordre-update'
import { titresEtapesAreasUpdate } from './processes/titres-etapes-areas-update'
import titresEtapesOrdreUpdate from './processes/titres-etapes-ordre-update'
import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresPhasesUpdate from './processes/titres-phases-update'
import titresEtapesAdministrationsLocalesUpdate from './processes/titres-etapes-administrations-locales-update'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titresPropsContenuUpdate from './processes/titres-props-contenu-update'
import { titresIdsUpdate } from './processes/titres-ids-update'
import titresPublicUpdate from './processes/titres-public-update'
import updatesLog from './_updates-log'
import titresCoordonneesUpdate from './processes/titres-coordonnees-update'

const titreEtapeUpdate = async (
  titreEtapeId: string | null,
  titreDemarcheId: string
) => {
  try {
    console.info()
    console.info('- - -')
    console.info(`mise à jour d'une étape : ${titreEtapeId}`)

    let titreId
    const titreDemarche = await titreDemarcheGet(
      titreDemarcheId,
      {
        fields: {
          etapes: { id: {} },
          type: { etapesTypes: { id: {} } },
          titre: { id: {} }
        }
      },
      'super'
    )

    if (!titreDemarche) {
      throw new Error(`la démarche ${titreDemarche} n'existe pas`)
    }

    const titresEtapesOrdreUpdated = await titresEtapesOrdreUpdate([
      titreDemarcheId
    ])

    titreId = titreDemarche.titreId
    const titresDemarchesStatutUpdated = await titresDemarchesStatutIdUpdate([
      titreId
    ])
    const titresDemarchesPublicUpdated = await titresDemarchesPublicUpdate([
      titreId
    ])
    const titresDemarchesOrdreUpdated = await titresDemarchesOrdreUpdate([
      titreId
    ])
    const titresStatutIdUpdated = await titresStatutIdsUpdate([titreId])
    const titresPublicUpdated = await titresPublicUpdate([titreId])
    const [
      titresPhasesUpdated = [],
      titresPhasesDeleted = []
    ] = await titresPhasesUpdate([titreId])
    const titresDatesUpdated = await titresDatesUpdate([titreId])
    let communesUpdated = [] as IArea[]
    let titresEtapesCommunesUpdated = [] as string[]
    let titresEtapesCommunesDeleted = [] as string[]
    let foretsUpdated = [] as IArea[]
    let titresEtapesForetsUpdated = [] as string[]
    let titresEtapesForetsDeleted = [] as string[]
    // si l'étape est supprimée, pas de mise à jour
    if (titreEtapeId) {
      const { titresCommunes, titresForets } = await titresEtapesAreasUpdate([
        titreEtapeId
      ])

      ;({
        areasUpdated: communesUpdated = [],
        titresEtapesAreasUpdated: titresEtapesCommunesUpdated = [],
        titresEtapesAreasDeleted: titresEtapesCommunesDeleted = []
      } = titresCommunes)
      ;({
        areasUpdated: foretsUpdated = [],
        titresEtapesAreasUpdated: titresEtapesForetsUpdated = [],
        titresEtapesAreasDeleted: titresEtapesForetsDeleted = []
      } = titresForets)
    }
    const {
      titresEtapesAdministrationsLocalesCreated = [],
      titresEtapesAdministrationsLocalesDeleted = []
    } = await titresEtapesAdministrationsLocalesUpdate([titreId])
    const titresPropsEtapeIdUpdated = await titresPropsEtapeIdUpdate([titreId])
    const titresPropsContenuUpdated = await titresPropsContenuUpdate([titreId])
    const titresCoordonneesUpdated = await titresCoordonneesUpdate([titreId])
    const titresActivitesCreated = await titresActivitesUpdate([titreId])

    // met à jour l'id dans le titre par effet de bord
    const titresUpdatedIndex = await titresIdsUpdate([titreId])
    const titreIdTmp = Object.keys(titresUpdatedIndex)[0]
    if (titreIdTmp) {
      titreId = titreIdTmp
    }
    updatesLog({
      titresEtapesOrdreUpdated,
      titresDemarchesStatutUpdated,
      titresDemarchesPublicUpdated,
      titresDemarchesOrdreUpdated,
      titresStatutIdUpdated,
      titresPublicUpdated,
      titresPhasesUpdated,
      titresPhasesDeleted,
      titresDatesUpdated,
      communesUpdated,
      titresEtapesCommunesUpdated,
      titresEtapesCommunesDeleted,
      foretsUpdated,
      titresEtapesForetsUpdated,
      titresEtapesForetsDeleted,
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted,
      titresPropsEtapeIdUpdated,
      titresPropsContenuUpdated,
      titresCoordonneesUpdated,
      titresActivitesCreated,
      titresUpdatedIndex
    })

    return titreId
  } catch (e) {
    console.error(`erreur: titreEtapeUpdate ${titreEtapeId}`)
    console.error(e)
    throw e
  }
}

export default titreEtapeUpdate
