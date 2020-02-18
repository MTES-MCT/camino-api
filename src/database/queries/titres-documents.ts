import { ITitreDocument } from '../../types'
import TitresDocuments from '../models/titres-documents'

const titreDocumentGet = async (titreDocumentId: string) =>
  TitresDocuments.query().findById(titreDocumentId)

const titresDocumentsGet = async () => TitresDocuments.query()

const titreDocumentCreate = async (titreDocument: ITitreDocument) =>
  TitresDocuments.query().insertAndFetch(titreDocument)

const titreDocumentUpdate = async (
  id: string,
  props: Partial<ITitreDocument>
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
