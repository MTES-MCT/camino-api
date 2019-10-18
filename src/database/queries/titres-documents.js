import TitresDocuments from '../models/titres-documents'

const titreDocumentGet = async titreDocumentId =>
  TitresDocuments.query().findById(titreDocumentId)

const titresDocumentsGet = async () => TitresDocuments.query()

const titreDocumentCreate = async document =>
  TitresDocuments.query().insertAndFetch(document)

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
