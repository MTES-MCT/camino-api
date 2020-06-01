import { titreEtapeGet } from '../database/queries/titres-etapes'
import { titreDemarcheGet } from '../database/queries/titres-demarches'
import { titreGet } from '../database/queries/titres'
import titrePropEtapeIdFind from './rules/titre-prop-etape-id-find'
import { IFields } from '../types'

const titreEtapeEntreprisesFind = async (
  titreEtapeId: string,
  fields: IFields
) => {
  try {
    const etape = await titreEtapeGet(titreEtapeId, {}, 'super')
    if (!etape) throw new Error("l'étape n'existe pas")

    const demarche = await titreDemarcheGet(etape.titreDemarcheId, {}, 'super')

    if (!demarche) throw new Error("la démarche n'existe pas")

    const titre = await titreGet(demarche.titreId, {}, 'super')
    if (!titre) throw new Error("le titre n'existe pas")

    // todo: supprimer toutes les démarches / étapes postérieures à l'étape actuelle

    const entreprises = []

    const titulairesTitreEtapeId = titrePropEtapeIdFind(
      titre.demarches!,
      titre.statutId!,
      'titulaires'
    )

    const amodiatairesTitreEtapeId = titrePropEtapeIdFind(
      titre.demarches!,
      titre.statutId!,
      'amodiataires'
    )

    if (titulairesTitreEtapeId) {
      const titulairesTitreEtape = await titreEtapeGet(
        titulairesTitreEtapeId,
        { fields: { titulaires: fields } },
        'super'
      )

      entreprises.push(...titulairesTitreEtape.titulaires!)
    }

    if (amodiatairesTitreEtapeId) {
      const amodiatairesTitreEtape = await titreEtapeGet(
        amodiatairesTitreEtapeId,
        { fields: { amodiataires: fields } },
        'super'
      )

      entreprises.push(...amodiatairesTitreEtape.amodiataires!)
    }

    return entreprises
  } catch (e) {
    console.error(`erreur: titreEtapeEntreprisesFind ${titreEtapeId}`)
    console.error(e)
    throw e
  }
}

export default titreEtapeEntreprisesFind
