import { GraphQLResolveInfo } from 'graphql'

import {
  IDecisionAnnexeContenu,
  IDocument,
  IEtapeType,
  ISDOMZone,
  ITitreEtape,
  ITitrePoint,
  IToken,
  IUtilisateur
} from '../../../types'

import { debug } from '../../../config/index'

import { titreFormat } from '../../_format/titres'

import {
  titreEtapeCreate,
  titreEtapeGet,
  titreEtapeUpdate,
  titreEtapeUpsert
} from '../../../database/queries/titres-etapes'
import { titreDemarcheGet } from '../../../database/queries/titres-demarches'
import { titreGet } from '../../../database/queries/titres'

import titreEtapeUpdateTask from '../../../business/titre-etape-update'
import {
  titreEtapeHeritageBuild,
  titreEtapePointsCalc,
  titreEtapeSdomZonesGet
} from './_titre-etape'
import { titreEtapeUpdationValidate } from '../../../business/validations/titre-etape-updation-validate'

import { fieldsBuild } from './_fields-build'
import { titreDemarcheUpdatedEtatValidate } from '../../../business/validations/titre-demarche-etat-validate'
import { titreEtapeFormat } from '../../_format/titres-etapes'
import {
  etapeTypeGet,
  titreTypeDemarcheTypeEtapeTypeGet
} from '../../../database/queries/metas'
import { userSuper } from '../../../database/user-super'
import { userGet } from '../../../database/queries/utilisateurs'
import { documentsLier } from './documents'
import {
  documentsTypesFormat,
  etapeTypeSectionsFormat
} from '../../_format/etapes-types'
import {
  contenuElementFilesCreate,
  contenuElementFilesDelete,
  contenuFilesPathGet,
  sectionsContenuAndFilesGet
} from '../../../business/utils/contenu-element-file-process'
import { permissionCheck } from '../../../business/permission'
import dateFormat from 'dateformat'
import {
  documentCreate,
  documentsGet
} from '../../../database/queries/documents'
import {
  titreEtapeAdministrationsEmailsSend,
  titreEtapeUtilisateursEmailsSend
} from './_titre-etape-email'
import { objectClone } from '../../../tools'
import { geojsonFeatureMultiPolygon } from '../../../tools/geojson'
import { idGenerate } from '../../../database/models/_format/id-create'
import fileRename from '../../../tools/file-rename'
import { documentFilePathFind } from '../../../tools/documents/document-path-find'

const statutIdAndDateGet = (
  etape: ITitreEtape,
  user: IUtilisateur,
  depose = false
): { date: string; statutId: string } => {
  const result = { date: etape.date, statutId: etape.statutId }

  if (depose) {
    if (etape.typeId !== 'mfr') {
      throw new Error('seules les demandes peuvent être déposées')
    }

    result.statutId = 'fai'
    if (permissionCheck(user.permissionId, ['entreprise'])) {
      result.date = dateFormat(new Date(), 'yyyy-mm-dd')
    }
  } else if (etape.typeId === 'mfr' && !etape.statutId) {
    result.statutId = 'aco'
  }

  return result
}

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
          id: {}
        }
      },
      user
    )

    if (!titreDemarche) throw new Error("la démarche n'existe pas")

    return titreEtapeFormat(titreEtape)
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

    const etapeType = await etapeTypeGet(typeId, {
      fields: { documentsTypes: { id: {} }, justificatifsTypes: { id: {} } }
    })

    const { sections, documentsTypes, justificatifsTypes } =
      await specifiquesGet(
        titreDemarche!.titre!.typeId,
        titreDemarche!.typeId,
        etapeType!
      )

    const titreEtape = titreEtapeHeritageBuild(
      date,
      etapeType!,
      titreDemarche!,
      sections,
      documentsTypes,
      justificatifsTypes
    )

    return titreEtapeFormat(titreEtape)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const specifiquesGet = async (
  titreTypeId: string,
  titreDemarcheTypeId: string,
  etapeType: IEtapeType
) => {
  const tde = await titreTypeDemarcheTypeEtapeTypeGet(
    {
      titreTypeId,
      demarcheTypeId: titreDemarcheTypeId,
      etapeTypeId: etapeType.id
    },
    { fields: { documentsTypes: { id: {} }, justificatifsTypes: { id: {} } } }
  )

  const sections = etapeTypeSectionsFormat(etapeType.sections, tde?.sections)

  const documentsTypes = documentsTypesFormat(
    etapeType.documentsTypes,
    tde?.documentsTypes
  )

  const justificatifsTypes = documentsTypesFormat(
    etapeType.justificatifsTypes,
    tde?.justificatifsTypes
  )

  return { sections, documentsTypes, justificatifsTypes }
}

const etapeCreer = async (
  { etape }: { etape: ITitreEtape },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!user) {
      throw new Error("la démarche n'existe pas")
    }

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

    if (!titreDemarche || !titreDemarche.titre)
      throw new Error("le titre n'existe pas")

    const etapeType = await etapeTypeGet(etape.typeId, {
      fields: { documentsTypes: { id: {} }, justificatifsTypes: { id: {} } }
    })

    if (!etapeType) {
      throw new Error(`le type d'étape "${etape.typeId}" n'existe pas`)
    }

    const { statutId, date } = statutIdAndDateGet(etape, user!)
    etape.statutId = statutId
    etape.date = date

    const { sections, documentsTypes, justificatifsTypes } =
      await specifiquesGet(
        titreDemarche.titre!.typeId,
        titreDemarche.typeId,
        etapeType
      )

    const justificatifs = etape.justificatifIds?.length
      ? await documentsGet(
          { ids: etape.justificatifIds },
          { fields: { type: { id: {} } } },
          userSuper
        )
      : null
    delete etape.justificatifIds
    etape.justificatifs = justificatifs

    const documentIds = etape.documentIds || []
    const documents = documentIds.length
      ? await documentsGet(
          { ids: documentIds },
          { fields: { type: { id: {} } } },
          userSuper
        )
      : null
    delete etape.documentIds

    const sdomZones = [] as ISDOMZone[]
    let titreEtapePoints = null
    if (etape.points?.length) {
      titreEtapePoints = titreEtapePointsCalc(etape.points)
      const geojsonFeatures = geojsonFeatureMultiPolygon(
        titreEtapePoints as ITitrePoint[]
      )

      sdomZones.push(...(await titreEtapeSdomZonesGet(geojsonFeatures)))
    }

    const rulesErrors = titreEtapeUpdationValidate(
      etape,
      titreDemarche,
      titreDemarche.titre,
      sections,
      documentsTypes,
      documents,
      justificatifsTypes,
      justificatifs,
      sdomZones
    )
    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    if (titreEtapePoints) {
      etape.points = titreEtapePoints
    }
    const { contenu, newFiles } = sectionsContenuAndFilesGet(
      etape.contenu,
      sections
    )
    etape.contenu = contenu

    const etapeUpdated = await titreEtapeUpsert(
      etape,
      user!,
      titreDemarche.titreId
    )

    await contenuElementFilesCreate(newFiles, 'demarches', etapeUpdated.id)

    await documentsLier(context, documentIds, etapeUpdated.id, 'titreEtapeId')

    await titreEtapeUpdateTask(
      etapeUpdated.id,
      etapeUpdated.titreDemarcheId,
      user
    )

    await titreEtapeAdministrationsEmailsSend(
      etapeUpdated,
      etapeType,
      titreDemarche.typeId,
      titreDemarche.titreId,
      titreDemarche.titre.typeId,
      user
    )
    await titreEtapeUtilisateursEmailsSend(
      etapeUpdated,
      etapeType,
      titreDemarche.typeId,
      titreDemarche.titreId
    )
    const fields = fieldsBuild(info)
    const titreUpdated = await titreGet(titreDemarche.titreId, { fields }, user)

    return titreFormat(titreUpdated!)
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

    if (!user) {
      throw new Error("l'étape n'existe pas")
    }

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

    if (!titreDemarche || !titreDemarche.titre)
      throw new Error("le titre n'existe pas")

    const etapeType = await etapeTypeGet(etape.typeId, {
      fields: { documentsTypes: { id: {} }, justificatifsTypes: { id: {} } }
    })
    if (!etapeType) {
      throw new Error(`le type d'étape "${etape.typeId}" n'existe pas`)
    }

    const { statutId, date } = statutIdAndDateGet(etape, user!)
    etape.statutId = statutId
    etape.date = date

    const { sections, documentsTypes, justificatifsTypes } =
      await specifiquesGet(
        titreDemarche.titre!.typeId,
        titreDemarche.typeId,
        etapeType
      )

    const justificatifs = etape.justificatifIds?.length
      ? await documentsGet(
          { ids: etape.justificatifIds },
          { fields: { type: { id: {} } } },
          userSuper
        )
      : null
    delete etape.justificatifIds
    etape.justificatifs = justificatifs

    const documentIds = etape.documentIds || []
    const documents = documentIds.length
      ? await documentsGet(
          { ids: documentIds },
          { fields: { type: { id: {} } } },
          userSuper
        )
      : null
    delete etape.documentIds

    const sdomZones = [] as ISDOMZone[]
    let titreEtapePoints = null
    if (etape.points?.length) {
      titreEtapePoints = titreEtapePointsCalc(etape.points)
      const geojsonFeatures = geojsonFeatureMultiPolygon(
        titreEtapePoints as ITitrePoint[]
      )

      sdomZones.push(...(await titreEtapeSdomZonesGet(geojsonFeatures)))
    }

    const rulesErrors = titreEtapeUpdationValidate(
      etape,
      titreDemarche,
      titreDemarche.titre,
      sections,
      documentsTypes,
      documents,
      justificatifsTypes,
      justificatifs,
      sdomZones
    )

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    if (titreEtapePoints) {
      etape.points = titreEtapePoints
    }
    await documentsLier(
      context,
      documentIds,
      etape.id,
      'titreEtapeId',
      titreEtapeOld
    )

    const { contenu, newFiles } = sectionsContenuAndFilesGet(
      etape.contenu,
      sections
    )
    etape.contenu = contenu

    if (titreEtapeOld.decisionsAnnexesSections) {
      const {
        contenu: decisionsAnnexesContenu,
        newFiles: decisionsAnnexesNewFiles
      } = sectionsContenuAndFilesGet(
        etape.decisionsAnnexesContenu,
        titreEtapeOld.decisionsAnnexesSections
      )
      etape.decisionsAnnexesContenu =
        decisionsAnnexesContenu as IDecisionAnnexeContenu
      await contenuElementFilesCreate(
        decisionsAnnexesNewFiles,
        'demarches',
        etape.id
      )
    }

    const etapeUpdated = await titreEtapeUpsert(
      etape,
      user!,
      titreDemarche.titreId
    )

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
      etape => etape.contenu,
      demarche!.etapes,
      titreEtapeOld.contenu
    )

    if (titreEtapeOld.decisionsAnnexesSections) {
      await contenuElementFilesDelete(
        'demarches',
        etapeUpdated.id,
        titreEtapeOld.decisionsAnnexesSections,
        etape => etape.decisionsAnnexesContenu,
        demarche!.etapes,
        titreEtapeOld.decisionsAnnexesContenu
      )
    }

    await titreEtapeUpdateTask(
      etapeUpdated.id,
      etapeUpdated.titreDemarcheId,
      user
    )

    await titreEtapeAdministrationsEmailsSend(
      etape,
      etapeType,
      titreDemarche.typeId,
      titreDemarche.titreId,
      titreDemarche.titre.typeId,
      user,
      titreEtapeOld
    )

    const fields = fieldsBuild(info)
    const titreUpdated = await titreGet(titreDemarche.titreId, { fields }, user)

    return titreFormat(titreUpdated!)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeDeposer = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!user) {
      throw new Error("l'étape n'existe pas")
    }

    let titreEtape = await titreEtapeGet(
      id,
      { fields: { type: { id: {} } } },
      user
    )

    if (!titreEtape) throw new Error("l'étape n'existe pas")
    const titreEtapeOld = objectClone(titreEtape)

    const titreDemarche = await titreDemarcheGet(
      titreEtape.titreDemarcheId,
      {
        fields: {
          titre: { id: {} }
        }
      },
      userSuper
    )

    titreEtape = titreEtapeFormat(titreEtape)

    if (!titreEtape.deposable || !titreDemarche)
      throw new Error('droits insuffisants')

    const statutIdAndDate = statutIdAndDateGet(titreEtape, user, true)

    let decisionsAnnexesContenu: IDecisionAnnexeContenu | null = null
    if (
      titreEtape.decisionsAnnexesSections &&
      titreEtape.decisionsAnnexesContenu
    ) {
      decisionsAnnexesContenu = titreEtape.decisionsAnnexesContenu
    }

    await titreEtapeUpdate(
      titreEtape.id,
      {
        ...statutIdAndDate,
        decisionsAnnexesSections: null,
        decisionsAnnexesContenu: null
      },
      user,
      titreDemarche.titreId
    )
    const etapeUpdated = await titreEtapeGet(
      titreEtape.id,
      {
        fields: { id: {} }
      },
      user
    )

    // Si il y a des décisions annexes, il faut générer une étape par décision
    if (decisionsAnnexesContenu) {
      for (const etapeTypeId of Object.keys(decisionsAnnexesContenu!)) {
        const decisionContenu = decisionsAnnexesContenu![etapeTypeId]
        let etapeDecisionAnnexe: Partial<ITitreEtape> = {
          typeId: etapeTypeId,
          titreDemarcheId: titreDemarche.id,
          date: decisionContenu.date,
          statutId: decisionContenu.statutId
        }

        etapeDecisionAnnexe = await titreEtapeCreate(
          etapeDecisionAnnexe as ITitreEtape,
          userSuper,
          titreDemarche.titreId
        )

        const documentTypeIds = Object.keys(decisionContenu).filter(
          key => !['date', 'statutId'].includes(key)
        )
        for (const documentTypeId of documentTypeIds) {
          const fileName = decisionContenu[documentTypeId]

          const id = idGenerate()
          const document: IDocument = {
            id,
            typeId: documentTypeId,
            date: decisionContenu.date,
            fichier: true,
            entreprisesLecture: true,
            titreEtapeId: etapeDecisionAnnexe.id,
            fichierTypeId: 'pdf'
          }

          const filePath = `${contenuFilesPathGet(
            'demarches',
            titreEtape.id
          )}/${fileName}`

          const newDocumentPath = await documentFilePathFind(document, true)

          await fileRename(filePath, newDocumentPath)

          await documentCreate(document)
        }
      }
    }

    await titreEtapeUpdateTask(
      etapeUpdated.id,
      etapeUpdated.titreDemarcheId,
      user
    )

    await titreEtapeAdministrationsEmailsSend(
      etapeUpdated,
      titreEtape.type!,
      titreDemarche.typeId,
      titreDemarche.titreId,
      titreDemarche.titre!.typeId,
      user!,
      titreEtapeOld
    )

    const fields = fieldsBuild(info)
    const titreUpdated = await titreGet(titreDemarche.titreId, { fields }, user)

    return titreFormat(titreUpdated!)
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

    if (!user) {
      throw new Error("l'étape n'existe pas")
    }

    const titreEtape = await titreEtapeGet(id, { fields: { id: {} } }, user)

    if (!titreEtape) throw new Error("l'étape n'existe pas")

    if (!titreEtape.modification) throw new Error('droits insuffisants')

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
    await titreEtapeUpdate(id, { archive: true }, user, titreDemarche.titreId)

    await titreEtapeUpdateTask(null, titreEtape.titreDemarcheId, user)

    const titreUpdated = await titreGet(titreDemarche.titreId, { fields }, user)

    return titreFormat(titreUpdated!)
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
  etapeDeposer,
  specifiquesGet
}
