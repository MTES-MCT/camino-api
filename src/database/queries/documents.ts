import { IDocument, IFields } from '../../types'

import { transaction, Transaction } from 'objection'

import Document from '../models/documents'
import { userGet } from './utilisateurs'
import graphBuild from './graph/build'
import options from './_options'

import { documentsPermissionQueryBuild } from './permissions/documents'

import { fieldsFormat } from './graph/fields-format'

const documentGet = async (
  documentId: string,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const graph = fields
    ? graphBuild(fields, 'documents', fieldsFormat)
    : options.documents.graph

  const user = await userGet(userId)

  const q = Document.query().withGraphFetched(graph)

  documentsPermissionQueryBuild(q, user)

  const document = await q.findById(documentId)

  return document as IDocument
}

const documentsGet = async (
  { entreprisesIds }: { entreprisesIds?: string[] },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const graph = fields
    ? graphBuild(fields, 'documents', fieldsFormat)
    : options.documents.graph

  const user = await userGet(userId)

  const q = Document.query().withGraphFetched(graph)

  if (entreprisesIds?.length) {
    q.whereIn('entrepriseId', entreprisesIds)
  }

  documentsPermissionQueryBuild(q, user)

  return q
}

const documentCreate = async (document: IDocument, tr?: Transaction) =>
  Document.query(tr)
    .withGraphFetched(options.documents.graph)
    .insertAndFetch(document)

const documentUpsert = async (document: IDocument, tr?: Transaction) =>
  Document.query(tr)
    .upsertGraph(document, options.documents.update)
    .withGraphFetched(options.documents.graph)
    .returning('*')

const documentUpdate = async (id: string, props: Partial<IDocument>) =>
  Document.query()
    .withGraphFetched(options.documents.graph)
    .patchAndFetchById(id, props)

const documentDelete = async (id: string, tr?: Transaction) =>
  Document.query(tr)
    .deleteById(id)
    .withGraphFetched(options.documents.graph)
    .returning('*')

const documentIdUpdate = async (documentOldId: string, document: IDocument) => {
  const knex = Document.knex()

  return transaction(knex, async tr => {
    await documentDelete(documentOldId, tr)

    return documentUpsert(document, tr)
  })
}

export {
  documentGet,
  documentsGet,
  documentCreate,
  documentUpdate,
  documentDelete,
  documentIdUpdate
}
