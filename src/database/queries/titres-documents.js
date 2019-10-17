import TitresDocuments from '../models/titres-documents'

const titreDocumentGet = async titreDocumentId =>
  TitresDocuments.query().findById(titreDocumentId)

const titresDocumentsGet = async () => TitresDocuments.query()

const titreDocumentCreate = async etape =>
  TitresDocuments.query().insertAndFetch(etape)

const titreDocumentUpdate = async (id, props) =>
  TitresDocuments.query().patchAndFetchById(id, props)

const titreDocumentDelete = async id =>
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
