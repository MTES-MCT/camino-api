import TitresDocuments from '../models/titres-documents'

const titreDocumentGet = async titreDocumentId =>
  TitresDocuments.query().findById(titreDocumentId)

const titresDocumentsGet = async () => TitresDocuments.query()

export { titreDocumentGet, titresDocumentsGet }
