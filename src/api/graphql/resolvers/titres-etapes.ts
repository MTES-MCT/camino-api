import { GraphQLResolveInfo } from 'graphql'

import { ITitreEtape, ITitreEtapeJustificatif, IToken } from '../../../types'

import { debug } from '../../../config/index'

import { titreFormat } from '../../_format/titres'

import {
  titreEtapeDelete,
  titreEtapeGet,
  titreEtapeJustificatifsDelete,
  titreEtapeUpsert,
  titresEtapesJustificatifsUpsert
} from '../../../database/queries/titres-etapes'
import { titreDemarcheGet } from '../../../database/queries/titres-demarches'
import { titreGet } from '../../../database/queries/titres'

import { fichiersRepertoireDelete } from './_titre-document'

import titreEtapeUpdateTask from '../../../business/titre-etape-update'
import { titreEtapeHeritageBuild, titreEtapePointsCalc } from './_titre-etape'
import { titreEtapeUpdationValidate } from '../../../business/validations/titre-etape-updation-validate'

import { fieldsBuild } from './_fields-build'
import { titreDemarcheUpdatedEtatValidate } from '../../../business/validations/titre-demarche-etat-validate'
import { titreEtapeFormat } from '../../_format/titres-etapes'
import { etapeTypeGet } from '../../../database/queries/metas'
import { userSuper } from '../../../database/user-super'
import { userGet } from '../../../database/queries/utilisateurs'
import { documentsModifier } from './documents'
import { etapeTypeSectionsFormat } from '../../_format/etapes-types'
import {
  contenuElementFilesCreate,
  contenuElementFilesDelete,
  sectionsContenuAndFilesGet
} from '../../../business/utils/contenu-element-file-process'

const etape = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    const fields = fieldsBuild(info)

    if (!fields.type) {
      fields.type = { id: {} }
    }

    const titreEtape = await titreEtapeGet(
      id,
      { fields, fetchHeritage: true },
      user
    )

    if (!titreEtape) {
      throw new Error("l'étape n'existe pas")
    }

    const titreDemarche = await titreDemarcheGet(
      titreEtape.titreDemarcheId,
      {
        fields: {
          titre: { id: {} },
          type: { etapesTypes: { id: {} } }
        }
      },
      user
    )

    if (!titreDemarche) throw new Error("la démarche n'existe pas")

    return titreEtapeFormat(
      titreEtape,
      titreDemarche.titre!.typeId,
      titreDemarche.type!.etapesTypes!
    )
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeHeritage = async (
  {
    date,
    titreDemarcheId,
    typeId
  }: { date: string; titreDemarcheId: string; typeId: string },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    let titreDemarche = await titreDemarcheGet(
      titreDemarcheId,
      { fields: {} },
      user
    )

    if (!titreDemarche) throw new Error("la démarche n'existe pas")

    titreDemarche = await titreDemarcheGet(
      titreDemarcheId,
      {
        fields: {
          type: { etapesTypes: { id: {} } },
          titre: { id: {} },
          etapes: {
            type: { id: {} },
            statut: { id: {} },
            titulaires: { id: {} },
            amodiataires: { id: {} },
            substances: { legales: { code: { id: {} } } },
            points: { references: { geoSysteme: { unite: { id: {} } } } }
          }
        }
      },
      userSuper
    )

    const etapeType = await etapeTypeGet(typeId, { fields: {} })
    const titreEtape = titreEtapeHeritageBuild(date, etapeType, titreDemarche)

    return titreEtapeFormat(
      titreEtape,
      titreDemarche.titre!.typeId,
      titreDemarche.type!.etapesTypes
    )
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeCreer = async (
  { etape }: { etape: ITitreEtape },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    let titreDemarche = await titreDemarcheGet(
      etape.titreDemarcheId,
      { fields: {} },
      user
    )

    if (!titreDemarche) throw new Error("la démarche n'existe pas")

    if (!titreDemarche.etapesCreation) throw new Error('droits insuffisants')

    titreDemarche = await titreDemarcheGet(
      etape.titreDemarcheId,
      {
        fields: {
          type: { etapesTypes: { etapesStatuts: { id: {} } } },
          titre: {
            type: { demarchesTypes: { id: {} } },
            demarches: { etapes: { id: {} } }
          },
          etapes: { type: { id: {} } }
        }
      },
      userSuper
    )

    if (!titreDemarche.titre) throw new Error("le titre n'existe pas")

    const etapeType = await etapeTypeGet(etape.typeId, {
      fields: { documentsTypes: { id: {} }, justificatifsTypes: { id: {} } }
    })

    if (!etapeType) {
      throw new Error(`le type d'étape "${etape.typeId}" n'existe pas`)
    }

    const sections = etapeTypeSectionsFormat(
      etapeType,
      titreDemarche.type!.etapesTypes,
      titreDemarche.titre!.typeId
    )

    const rulesErrors = await titreEtapeUpdationValidate(
      etape,
      titreDemarche,
      titreDemarche.titre,
      sections,
      etapeType.documentsTypes!,
      etapeType.justificatifsTypes!
    )
    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    if (etape.points) {
      etape.points = titreEtapePointsCalc(etape.points)
    }

    const documents = etape.documents || []
    delete etape.documents

    const { contenu, newFiles } = sectionsContenuAndFilesGet(
      etape.contenu,
      sections
    )
    etape.contenu = contenu

    const etapeUpdated = await titreEtapeUpsert(etape)

    await contenuElementFilesCreate(newFiles, 'demarches', etapeUpdated.id)

    await documentsModifier(
      context,
      { id: etapeUpdated.id, documents },
      'titreEtapeId'
    )

    const titreUpdatedId = await titreEtapeUpdateTask(
      etapeUpdated.id,
      etapeUpdated.titreDemarcheId
    )

    const fields = fieldsBuild(info)
    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user)

    return titreFormat(titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeModifier = async (
  { etape }: { etape: ITitreEtape },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    const titreEtapeOld = await titreEtapeGet(
      etape.id,
      { fields: { documents: { id: {} } } },
      user
    )

    if (!titreEtapeOld) throw new Error("l'étape n'existe pas")

    if (!titreEtapeOld.modification) throw new Error('droits insuffisants')

    if (titreEtapeOld.titreDemarcheId !== etape.titreDemarcheId)
      throw new Error("la démarche n'existe pas")

    const titreDemarche = await titreDemarcheGet(
      etape.titreDemarcheId,
      {
        fields: {
          type: { etapesTypes: { etapesStatuts: { id: {} } } },
          titre: {
            type: { demarchesTypes: { id: {} } },
            demarches: { etapes: { id: {} } }
          },
          etapes: { type: { id: {} } }
        }
      },
      userSuper
    )

    if (!titreDemarche.titre) throw new Error("le titre n'existe pas")

    const etapeType = await etapeTypeGet(etape.typeId, {
      fields: { documentsTypes: { id: {} }, justificatifsTypes: { id: {} } }
    })
    if (!etapeType) {
      throw new Error(`le type d'étape "${etape.typeId}" n'existe pas`)
    }

    const sections = etapeTypeSectionsFormat(
      etapeType,
      titreDemarche.type!.etapesTypes,
      titreDemarche.titre!.typeId
    )

    const rulesErrors = await titreEtapeUpdationValidate(
      etape,
      titreDemarche,
      titreDemarche.titre,
      sections,
      etapeType.documentsTypes!,
      etapeType.justificatifsTypes!
    )

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    if (etape.points) {
      etape.points = titreEtapePointsCalc(etape.points)
    }

    await documentsModifier(context, etape, 'titreEtapeId', titreEtapeOld)

    const { contenu, newFiles } = sectionsContenuAndFilesGet(
      etape.contenu,
      sections
    )
    etape.contenu = contenu

    const etapeUpdated = await titreEtapeUpsert(etape)

    await contenuElementFilesCreate(newFiles, 'demarches', etapeUpdated.id)

    // après le recalcule de l’héritage, on recharge toutes les étapes de la démarche pour pouvoir récuperer
    // tous les fichiers tjrs présents dans le contenu de chaque étape
    const demarche = await titreDemarcheGet(
      etapeUpdated.titreDemarcheId,
      { fields: { etapes: { id: {} } } },
      userSuper
    )
    await contenuElementFilesDelete(
      'demarches',
      etapeUpdated.id,
      sections,
      demarche.etapes,
      titreEtapeOld.contenu
    )

    const titreUpdatedId = await titreEtapeUpdateTask(
      etapeUpdated.id,
      etapeUpdated.titreDemarcheId
    )

    const fields = fieldsBuild(info)
    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user)

    return titreFormat(titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeSupprimer = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)
    const user = await userGet(context.user?.id)

    const titreEtape = await titreEtapeGet(id, { fields: { id: {} } }, user)

    if (!titreEtape) throw new Error("l'étape n'existe pas")

    if (!titreEtape.suppression) throw new Error('droits insuffisants')

    const titreDemarche = await titreDemarcheGet(
      titreEtape.titreDemarcheId,
      {
        fields: {
          type: { etapesTypes: { etapesStatuts: { id: {} } } },
          titre: {
            type: { demarchesTypes: { id: {} } },
            demarches: { etapes: { id: {} } }
          },
          etapes: { type: { id: {} } }
        }
      },
      userSuper
    )

    if (!titreDemarche) throw new Error("la démarche n'existe pas")

    if (!titreDemarche.titre) throw new Error("le titre n'existe pas")

    const rulesErrors = await titreDemarcheUpdatedEtatValidate(
      titreDemarche.type!,
      titreDemarche.titre,
      titreEtape,
      titreDemarche.etapes!,
      true
    )

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    await titreEtapeDelete(id)

    await fichiersRepertoireDelete(id, 'demarches')

    const titreUpdatedId = await titreEtapeUpdateTask(
      null,
      titreEtape.titreDemarcheId
    )

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user)

    return titreFormat(titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeJustificatifsAssocier = async (
  { id, documentsIds }: { id: string; documentsIds: string[] },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    const titreEtape = await titreEtapeGet(
      id,
      { fields: { justificatifs: { id: {} } } },
      user
    )

    if (!titreEtape) throw new Error("l'étape n'existe pas")

    if (!titreEtape.justificatifsAssociation)
      throw new Error('droits insuffisants')

    const titreDemarche = await titreDemarcheGet(
      titreEtape.titreDemarcheId,
      { fields: {} },
      user
    )

    if (!titreDemarche) throw new Error("la démarche n'existe pas")

    const titre = await titreGet(
      titreDemarche.titreId,
      {
        fields: {
          administrationsGestionnaires: { id: {} },
          administrationsLocales: { id: {} }
        }
      },
      user
    )

    if (!titre) throw new Error("le titre n'existe pas")

    await titreEtapeJustificatifsDelete(titreEtape.id)

    const titreEtapeId = titreEtape.id

    if (documentsIds.length) {
      await titresEtapesJustificatifsUpsert(
        documentsIds.map(
          documentId =>
            ({ documentId, titreEtapeId } as ITitreEtapeJustificatif)
        )
      )
    }

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titre.id, { fields }, user)

    return titreFormat(titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeJustificatifDissocier = async (
  { id, documentId }: { id: string; documentId: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    const titreEtape = await titreEtapeGet(
      id,
      { fields: { justificatifs: { id: {} } } },
      user
    )

    if (!titreEtape) throw new Error("l'étape n'existe pas")

    if (!titreEtape.justificatifsAssociation)
      throw new Error('droits insuffisants')

    const titreDemarche = await titreDemarcheGet(
      titreEtape.titreDemarcheId,
      { fields: {} },
      user
    )

    if (!titreDemarche) throw new Error("la démarche n'existe pas")

    const titre = await titreGet(
      titreDemarche.titreId,
      {
        fields: {
          administrationsGestionnaires: { id: {} },
          administrationsLocales: { id: {} }
        }
      },
      user
    )

    if (!titre) throw new Error("le titre n'existe pas")

    await titreEtapeJustificatifsDelete(titreEtape.id, documentId)

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titre.id, { fields }, user)

    return titreFormat(titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export {
  etape,
  etapeHeritage,
  etapeCreer,
  etapeModifier,
  etapeSupprimer,
  etapeJustificatifsAssocier,
  etapeJustificatifDissocier
}
