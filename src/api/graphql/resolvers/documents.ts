import {
  IDocument,
  IToken,
  IDocumentRepertoire,
  IUtilisateur,
  IDocumentType,
  ITitreEtape
} from '../../../types'
import { FileUpload } from 'graphql-upload'

import { join } from 'path'
import * as cryptoRandomString from 'crypto-random-string'

import { debug } from '../../../config/index'
import fileDelete from '../../../tools/file-delete'
import fileStreamCreate from '../../../tools/file-stream-create'
import { permissionCheck } from '../../../tools/permission'
import dirCreate from '../../../tools/dir-create'

import {
  documentsGet,
  documentGet,
  documentCreate,
  documentUpdate,
  documentDelete,
  documentIdUpdate
} from '../../../database/queries/documents'

import { userGet } from '../../../database/queries/utilisateurs'
import { documentTypeGet } from '../../../database/queries/metas'

import fieldsBuild from './_fields-build'
import { GraphQLResolveInfo } from 'graphql'
import fileRename from '../../../tools/file-rename'
import { titreEtapePermissionAdministrationsCheck } from '../../_permissions/titre-edition'
import { titreDemarcheGet } from '../../../database/queries/titres-demarches'
import { titreGet } from '../../../database/queries/titres'
import { titreEtapeGet } from '../../../database/queries/titres-etapes'
import { titreActiviteGet } from '../../../database/queries/titres-activites'

import documentInputValidate from '../../_validate/document-input-validate'
import documentUpdationValidate from '../../../business/validations/document-updation-validate'
import { titreTravauxEtapeGet } from '../../../database/queries/titres-travaux-etapes'
import { titreTravauxGet } from '../../../database/queries/titres-travaux'

const documentFileDirPathFind = (
  document: IDocument,
  repertoire: IDocumentRepertoire
) =>
  `files/${repertoire}/${
    document.titreEtapeId ||
    document.titreActiviteId ||
    document.entrepriseId ||
    document.titreTravauxEtapeId
  }`

const documentFilePathFind = (document: IDocument, dirPath: string) =>
  `${dirPath}/${document.id}.${document.fichierTypeId}`

const errorEtapesAssocieesUpdate = (
  etapesAssociees: ITitreEtape[],
  action: 'supprimer' | 'modifier'
) =>
  `impossible de ${action} ce document lié ${
    etapesAssociees.length > 1 ? 'aux étapes' : 'à l’étape'
  } ${etapesAssociees.map(e => e.id).join(', ')}`

const documentFileCreate = async (
  document: IDocument,
  repertoire: IDocumentRepertoire,
  fileUpload: FileUpload
) => {
  const dirPath = documentFileDirPathFind(document, repertoire)

  await dirCreate(dirPath)

  const documentFilePath = documentFilePathFind(document, dirPath)
  const { createReadStream } = await fileUpload

  await fileStreamCreate(
    createReadStream(),
    join(process.cwd(), documentFilePath)
  )
}

const documents = async (
  { entreprisesIds }: { entreprisesIds?: string[] },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))
    if (!user || !permissionCheck(user?.permissionId, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const fields = fieldsBuild(info)
    const documents = await documentsGet(
      { entreprisesIds },
      { fields },
      user.id
    )

    return documents
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const documentRepertoireCheck = (
  documentType: IDocumentType | undefined,
  document: IDocument
) => {
  if (!documentType) {
    throw new Error('type de document incorrect')
  }

  if (
    (documentType.repertoire === 'activites' && !document.titreActiviteId) ||
    (documentType.repertoire === 'demarches' && !document.titreEtapeId) ||
    (documentType.repertoire === 'entreprises' && !document.entrepriseId) ||
    (documentType.repertoire === 'travaux' && !document.titreTravauxEtapeId)
  ) {
    throw new Error("le répertoire et l'élément lié ne correspondent pas")
  }
}

const documentPermisssionsCheck = async (
  document: IDocument,
  user?: IUtilisateur
) => {
  if (
    !document.titreEtapeId &&
    !document.titreActiviteId &&
    !document.entrepriseId &&
    !document.titreTravauxEtapeId
  ) {
    throw new Error(
      "id d'étape, d'activité, d'entreprise ou d'étape de travaux manquant"
    )
  }

  if (!user) throw new Error('droits insuffisants')

  if (document.titreEtapeId) {
    if (!permissionCheck(user?.permissionId, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const etape = await titreEtapeGet(
      document.titreEtapeId,
      { fields: {} },
      user && user.id
    )
    if (!etape) throw new Error("l’étape n'existe pas")

    const demarche = await titreDemarcheGet(
      etape.titreDemarcheId,
      { fields: {} },
      user && user.id
    )
    if (!demarche) throw new Error("la démarche n'existe pas")

    const titre = await titreGet(
      demarche.titreId,
      {
        fields: {
          administrationsGestionnaires: { id: {} },
          administrationsLocales: { id: {} }
        }
      },
      user.id
    )
    if (!titre) throw new Error("le titre n'existe pas")

    const titreEtapePermission = await titreEtapePermissionAdministrationsCheck(
      user,
      titre.id,
      etape.typeId,
      'modification'
    )

    if (!titreEtapePermission) {
      throw new Error("droits insuffisants pour modifier ce document d'étape")
    }
  } else if (document.entrepriseId) {
    if (
      !permissionCheck(user?.permissionId, ['super', 'admin', 'editeur']) &&
      permissionCheck(user?.permissionId, ['entreprise']) &&
      !user.entreprises?.find(e => e.id === document.entrepriseId)
    ) {
      throw new Error(
        "droits insuffisants pour modifier ce document d'entreprise"
      )
    }
  } else if (document.titreActiviteId) {
    // si l'activité est récupérée depuis la base
    // alors on a le droit de la visualiser, donc de l'éditer
    const activite = await titreActiviteGet(
      document.titreActiviteId,
      { fields: { type: { titresTypes: { id: {} } }, titre: { id: {} } } },
      user.id
    )
    if (!activite) throw new Error("l'activité n'existe pas")

    if (
      !permissionCheck(user?.permissionId, ['super', 'admin']) &&
      activite.statutId === 'dep'
    ) {
      throw new Error(
        'cette activité a été validée et ne peux plus être modifiée'
      )
    }
  } else if (document.titreTravauxEtapeId) {
    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const etape = await titreTravauxEtapeGet(
      document.titreTravauxEtapeId,
      { fields: {} },
      user && user.id
    )
    if (!etape) throw new Error("l’étape de travaux n'existe pas")

    const travaux = await titreTravauxGet(etape.titreTravauxId, { fields: {} })
    if (!travaux) throw new Error("la démarche n'existe pas")

    const titre = await titreGet(
      travaux.titreId,
      {
        fields: {
          administrationsGestionnaires: { id: {} },
          administrationsLocales: { id: {} }
        }
      },
      user.id
    )
    if (!titre) throw new Error("le titre n'existe pas")
  }
}

const documentCreer = async (
  { document }: { document: IDocument },
  context: IToken
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    await documentPermisssionsCheck(document, user)

    const documentType = await documentTypeGet(document.typeId)

    documentRepertoireCheck(documentType, document)

    const errors = await documentInputValidate(document)

    const rulesErrors = await documentUpdationValidate(document)

    if (errors.length || rulesErrors.length) {
      throw new Error(errors.concat(rulesErrors).join(', '))
    }

    const hash = cryptoRandomString({ length: 8 })

    document.id = `${document.date}-${document.typeId}-${hash}`

    if (document.fichierNouveau) {
      document.fichier = true

      await documentFileCreate(
        document,
        documentType.repertoire,
        document.fichierNouveau.file
      )
    }

    if (document.publicLecture) {
      document.entreprisesLecture = true
    }

    delete document.fichierNouveau

    const documentUpdated = await documentCreate(document)

    return documentUpdated
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const documentModifier = async (
  { document }: { document: IDocument },
  context: IToken
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    await documentPermisssionsCheck(document, user)

    const documentOld = await documentGet(document.id, {}, user!.id)
    if (!documentOld) {
      throw new Error('aucun document avec cette id')
    }

    if (documentOld.etapesAssociees && documentOld.etapesAssociees.length > 0) {
      throw new Error(
        errorEtapesAssocieesUpdate(documentOld.etapesAssociees, 'modifier')
      )
    }

    const documentType = await documentTypeGet(document.typeId)

    documentRepertoireCheck(documentType, document)

    const errors = await documentInputValidate(document)
    const rulesErrors = await documentUpdationValidate(document)

    if (errors.length || rulesErrors.length) {
      const e = errors.concat(rulesErrors)
      throw new Error(e.join(', '))
    }

    if (document.publicLecture) {
      document.entreprisesLecture = true
    }

    const documentFichierNouveau = document.fichierNouveau

    document.fichier = !!document.fichierNouveau || document.fichier

    // cette propriété qui vient du front n'existe pas en base
    delete document.fichierNouveau

    const documentUpdated = await documentUpdate(document.id, document)

    // si la date ou le type de fichier ont changé
    // alors on change l'id et renomme le fichier s'il y en a un
    if (
      document.date !== documentOld.date ||
      document.typeId !== documentOld.typeId
    ) {
      const hash = documentOld.id.split('-').pop()
      const documentIdNew = `${documentUpdated.date}-${documentUpdated.typeId}-${hash}`

      documentUpdated.id = documentIdNew

      await documentIdUpdate(documentOld.id, documentUpdated)

      if (!documentFichierNouveau && document.fichier && documentOld.fichier) {
        const dirPath = documentFileDirPathFind(
          documentUpdated,
          documentType.repertoire
        )

        const documentOldFilePath = documentFilePathFind(documentOld, dirPath)
        const documentFilePath = documentFilePathFind(documentUpdated, dirPath)

        await fileRename(documentOldFilePath, documentFilePath)
      }
    }

    // supprime de l'ancien fichier
    if (
      (documentFichierNouveau || !documentUpdated.fichier) &&
      documentOld.fichier
    ) {
      const dirPath = documentFileDirPathFind(
        documentOld,
        documentType.repertoire
      )
      const documentOldFilePath = documentFilePathFind(documentOld, dirPath)

      try {
        await fileDelete(join(process.cwd(), documentOldFilePath))
      } catch (e) {
        console.info(
          `impossible de supprimer le fichier: ${documentOldFilePath}`
        )
      }
    }

    // enregistre le nouveau fichier
    if (documentFichierNouveau) {
      await documentFileCreate(
        documentUpdated,
        documentType.repertoire,
        documentFichierNouveau.file
      )
    }

    return documentUpdated
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const documentSupprimer = async ({ id }: { id: string }, context: IToken) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user) {
      throw new Error('droits insuffisants')
    }

    const documentOld = await documentGet(id, {}, user!.id)
    if (!documentOld) {
      throw new Error('aucun document avec cette id')
    }

    if (documentOld.etapesAssociees && documentOld.etapesAssociees.length > 0) {
      throw new Error(
        errorEtapesAssocieesUpdate(documentOld.etapesAssociees, 'supprimer')
      )
    }

    await documentPermisssionsCheck(documentOld, user)

    if (documentOld.fichier) {
      const dirPath = documentFileDirPathFind(
        documentOld,
        documentOld.type!.repertoire
      )
      const documentOldFilePath = documentFilePathFind(documentOld, dirPath)

      try {
        await fileDelete(join(process.cwd(), documentOldFilePath))
      } catch (e) {
        console.info(
          `impossible de supprimer le fichier: ${documentOldFilePath}`
        )
      }
    }

    await documentDelete(id)

    return true
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { documents, documentCreer, documentModifier, documentSupprimer }
