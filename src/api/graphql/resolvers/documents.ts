import { GraphQLResolveInfo } from 'graphql'
import { FileUpload } from 'graphql-upload'
import { join } from 'path'
import cryptoRandomString from 'crypto-random-string'

import { IDocument, IToken, ITitreEtape, IUtilisateur } from '../../../types'

import { debug } from '../../../config/index'
import fileDelete from '../../../tools/file-delete'
import fileStreamCreate from '../../../tools/file-stream-create'

import {
  documentsGet,
  documentGet,
  documentCreate,
  documentUpdate,
  documentDelete
} from '../../../database/queries/documents'

import { documentTypeGet } from '../../../database/queries/metas'

import { fieldsBuild } from './_fields-build'
import fileRename from '../../../tools/file-rename'
import { titreEtapeGet } from '../../../database/queries/titres-etapes'
import { titreActiviteGet } from '../../../database/queries/titres-activites'

import { documentInputValidate } from '../../../business/validations/document-input-validate'
import { documentUpdationValidate } from '../../../business/validations/document-updation-validate'
import { entrepriseGet } from '../../../database/queries/entreprises'
import { userGet } from '../../../database/queries/utilisateurs'
import { permissionCheck } from '../../../business/permission'
import { userSuper } from '../../../database/user-super'
import { documentFilePathFind } from '../../../tools/documents/document-path-find'

const errorEtapesAssocieesUpdate = (
  etapesAssociees: ITitreEtape[],
  action: 'supprimer' | 'modifier'
) =>
  `impossible de ${action} ce document lié ${
    etapesAssociees.length > 1 ? 'aux étapes' : 'à l’étape'
  } ${etapesAssociees.map(e => e.id).join(', ')}`

const documentFileCreate = async (
  document: IDocument,
  fileUpload: FileUpload
) => {
  const documentFilePath = await documentFilePathFind(document, true)
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
    const user = await userGet(context.user?.id)

    const fields = fieldsBuild(info)
    const documents = await documentsGet({ entreprisesIds }, { fields }, user)

    return documents
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const documentPermissionsCheck = async (
  document: IDocument,
  user: IUtilisateur | null | undefined
) => {
  if (!user) throw new Error('droits insuffisants')

  if (document.titreEtapeId) {
    const titreEtape = await titreEtapeGet(
      document.titreEtapeId,
      { fields: {} },
      user
    )

    if (!titreEtape) throw new Error("l’étape n'existe pas")

    if (!titreEtape.modification) throw new Error('droits insuffisants')
  } else if (document.entrepriseId) {
    const entreprise = await entrepriseGet(
      document.entrepriseId,
      { fields: {} },
      user
    )

    if (!entreprise) throw new Error("l'entreprise n'existe pas")

    if (!entreprise.modification) throw new Error('droits insuffisants')
  } else if (document.titreActiviteId) {
    // si l'activité est récupérée depuis la base
    // alors on a le droit de la visualiser, donc de l'éditer
    const activite = await titreActiviteGet(
      document.titreActiviteId,
      { fields: { type: { titresTypes: { id: {} } }, titre: { id: {} } } },
      user
    )

    if (!activite) throw new Error("l'activité n'existe pas")

    if (!activite.modification) throw new Error('droits insuffisants')
  }
}

const documentCreer = async (
  { document }: { document: IDocument },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info)

    if (!user) {
      throw new Error('droit insuffisants')
    }

    await documentPermissionsCheck(document, user)

    const documentType = await documentTypeGet(document.typeId)

    if (!documentType) {
      throw new Error('type de document manquant')
    }

    const errors = await documentInputValidate(document)

    const rulesErrors = await documentUpdationValidate(document)

    if (errors.length || rulesErrors.length) {
      throw new Error(errors.concat(rulesErrors).join(', '))
    }

    const hash = cryptoRandomString({ length: 8 })
    document.id = `${document.date}-${document.typeId}-${hash}`

    // Enregistre le nouveau fichier
    // - arrivé via API (requêtes libres)
    if (document.fichierNouveau) {
      document.fichier = true
      await documentFileCreate(document, document.fichierNouveau.file)
    } else {
      // - arrivé via UI
      const pathFrom = `/files/tmp/${document.nomTemporaire}`
      const pathTo = await documentFilePathFind(document, true)

      await fileRename(pathFrom, pathTo)
    }

    if (
      document.publicLecture ||
      permissionCheck(user.permissionId, ['entreprise'])
    ) {
      document.entreprisesLecture = true
    }

    const { id } = await documentCreate(document)

    const documentUpdated = await documentGet(id, { fields }, user)

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
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info)

    if (!user) {
      throw new Error('droit insuffisants')
    }

    const documentOld = await documentGet(document.id, {}, user)
    if (!documentOld) throw new Error("le document n'existe pas")

    await documentPermissionsCheck(document, user)

    if (documentOld.etapesAssociees && documentOld.etapesAssociees.length > 0) {
      throw new Error(
        errorEtapesAssocieesUpdate(documentOld.etapesAssociees, 'modifier')
      )
    }

    const errors = await documentInputValidate(document)
    const rulesErrors = await documentUpdationValidate(document)

    if (errors.length || rulesErrors.length) {
      const e = errors.concat(rulesErrors)
      throw new Error(e.join(', '))
    }

    if (
      document.publicLecture ||
      permissionCheck(user.permissionId, ['entreprise'])
    ) {
      document.entreprisesLecture = true
    }

    const documentFichierNouveau = document.fichierNouveau

    document.fichier = !!document.fichierNouveau || document.fichier

    const documentUpdated = await documentUpdate(document.id, document)

    // supprime de l'ancien fichier
    if (
      (documentFichierNouveau || !documentUpdated.fichier) &&
      documentOld.fichier
    ) {
      const documentOldFilePath = await documentFilePathFind(documentOld)

      try {
        await fileDelete(join(process.cwd(), documentOldFilePath))
      } catch (e) {
        console.info(
          `impossible de supprimer le fichier: ${documentOldFilePath}`
        )
      }
    }

    // Enregistre le nouveau fichier
    // - arrivé via API (requêtes libres)
    if (documentFichierNouveau) {
      await documentFileCreate(documentUpdated, documentFichierNouveau.file)
    } else {
      // - arrivé via UI
      if (document.nomTemporaire) {
        const pathFrom = `/files/tmp/${document.nomTemporaire}`
        const pathTo = await documentFilePathFind(document, true)

        await fileRename(pathFrom, pathTo)
      }
    }

    return await documentGet(documentUpdated.id, { fields }, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const documentSupprimer = async ({ id }: { id: string }, context: IToken) => {
  try {
    const user = await userGet(context.user?.id)

    if (!user) throw new Error('droits insuffisants')

    const documentOld = await documentGet(
      id,
      {
        fields: {
          type: {
            activitesTypes: { id: {} },
            etapesTypes: { id: {} }
          },
          etapesAssociees: { id: {} }
        }
      },
      user
    )

    if (!documentOld) {
      throw new Error('aucun document avec cette id')
    }

    if (documentOld.etapesAssociees && documentOld.etapesAssociees.length > 0) {
      throw new Error(
        errorEtapesAssocieesUpdate(documentOld.etapesAssociees, 'supprimer')
      )
    }

    if (!documentOld.suppression) {
      throw new Error('droits insuffisants')
    }

    await documentPermissionsCheck(documentOld, user)

    if (documentOld.fichier) {
      const documentOldFilePath = await documentFilePathFind(documentOld)

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

const documentsLier = async (
  context: IToken,
  documentIds: string[],
  parentId: string,
  propParentId: 'titreActiviteId' | 'titreEtapeId',
  oldParent?: { documents?: IDocument[] | null }
) => {
  if (oldParent?.documents?.length) {
    // supprime les anciens documents ou ceux qui n'ont pas de fichier
    const oldDocumentsIds = oldParent.documents.map(d => d.id)
    for (const oldDocumentId of oldDocumentsIds) {
      const documentId = documentIds.find(id => id === oldDocumentId)

      if (!documentId) {
        await documentSupprimer({ id: oldDocumentId }, context)
      }
    }
  }

  // lie des documents
  for (const documentId of documentIds) {
    const document = await documentGet(documentId, { fields: {} }, userSuper)

    if (!document[propParentId]) {
      await documentUpdate(document.id, { [propParentId]: parentId })

      if (document.fichier) {
        const documentPath = await documentFilePathFind(document)
        document[propParentId] = parentId

        const newDocumentPath = await documentFilePathFind(document, true)

        await fileRename(documentPath, newDocumentPath)
      }
    }
  }
}

export {
  documents,
  documentCreer,
  documentModifier,
  documentSupprimer,
  documentsLier
}
