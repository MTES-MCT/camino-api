import {
  IDocument,
  IToken,
  IDocumentRepertoire,
  IDocumentType,
  ITitreEtape,
  IUtilisateur
} from '../../../types'
import { FileUpload } from 'graphql-upload'

import { join } from 'path'
import * as cryptoRandomString from 'crypto-random-string'

import { debug } from '../../../config/index'
import fileDelete from '../../../tools/file-delete'
import fileStreamCreate from '../../../tools/file-stream-create'
import dirCreate from '../../../tools/dir-create'

import {
  documentsGet,
  documentGet,
  documentCreate,
  documentUpdate,
  documentDelete,
  documentIdUpdate
} from '../../../database/queries/documents'

import { documentTypeGet } from '../../../database/queries/metas'

import fieldsBuild from './_fields-build'
import { GraphQLResolveInfo } from 'graphql'
import fileRename from '../../../tools/file-rename'
import { titreEtapeGet } from '../../../database/queries/titres-etapes'
import { titreActiviteGet } from '../../../database/queries/titres-activites'

import { documentInputValidate } from '../../_validate/document-input-validate'
import { documentUpdationValidate } from '../../../business/validations/document-updation-validate'
import { titreTravauxEtapeGet } from '../../../database/queries/titres-travaux-etapes'
import { entrepriseGet } from '../../../database/queries/entreprises'
import { userGet } from '../../../database/queries/utilisateurs'

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

const documentPermissionsCheck = async (
  document: IDocument,
  user: IUtilisateur | null
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
  } else if (document.titreTravauxEtapeId) {
    const titreTravauxEtape = await titreTravauxEtapeGet(
      document.titreTravauxEtapeId,
      { fields: {} },
      user
    )

    if (!titreTravauxEtape) throw new Error("l’étape de travaux n'existe pas")

    if (!titreTravauxEtape.modification) throw new Error('droits insuffisants')
  }
}

const documentCreer = async (
  { document }: { document: IDocument },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    await documentPermissionsCheck(document, user)

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
    const user = await userGet(context.user?.id)

    const documentOld = await documentGet(document.id, {}, user)
    if (!documentOld) throw new Error("le document n'existe pas")

    await documentPermissionsCheck(document, user)

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
    const user = await userGet(context.user?.id)

    if (!user) throw new Error('droits insuffisants')

    const documentOld = await documentGet(id, {}, user)
    if (!documentOld) throw new Error("le document n'existe pas")

    if (documentOld.etapesAssociees && documentOld.etapesAssociees.length > 0) {
      throw new Error(
        errorEtapesAssocieesUpdate(documentOld.etapesAssociees, 'supprimer')
      )
    }

    await documentPermissionsCheck(documentOld, user)

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
