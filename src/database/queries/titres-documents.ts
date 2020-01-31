import { ITitresDocuments } from '../../types'
import TitresDocuments from '../models/titres-documents'

const titreDocumentGet = async (titreDocumentId: string) =>
  TitresDocuments.query().findById(titreDocumentId)

const titresDocumentsGet = async () => TitresDocuments.query()

const titreDocumentCreate = async (titreDocument: ITitresDocuments) =>
  TitresDocuments.query().insertAndFetch(titreDocument)

const titreDocumentUpdate = async (
  id: string,
  props: Partial<ITitresDocuments>
) => TitresDocuments.query().patchAndFetchById(id, props)

const titreDocumentDelete = async (id: string) =>
  TitresDocuments.query()
    .deleteById(id)
    .returning('*')

export {
  titreDocumentGet,
  titresDocumentsGet,
  titreDocumentCreate,
  titreDocumentUpdate,
  titreDocumentDelete
}
