import { IDocument, IFields } from '../../types'

import Document from '../models/documents'
import { userGet } from './utilisateurs'
import graphBuild from './graph/build'
import options from './_options'

import { documentsPermissionQueryBuild } from './permissions/documents'

import graphFormat from './graph/format'

const documentGet = async (
  documentId: string,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const graph = fields
    ? graphBuild(fields, 'etapes', graphFormat)
    : options.documents.graph

  const user = await userGet(userId)

  const q = Document.query().withGraphFetched(graph)

  documentsPermissionQueryBuild(q, user)

  return (await q.findById(documentId)) as IDocument
}

const documentsGet = async () => Document.query()

const documentCreate = async (document: IDocument) =>
  Document.query().insertAndFetch(document)

const documentUpdate = async (id: string, props: Partial<IDocument>) =>
  Document.query().patchAndFetchById(id, props)

const documentDelete = async (id: string) =>
  Document.query()
    .deleteById(id)
    .returning('*')

export {
  documentGet,
  documentsGet,
  documentCreate,
  documentUpdate,
  documentDelete
}
