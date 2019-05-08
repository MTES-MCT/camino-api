import TitresDocuments from '../models/titres-documents'

const titresDocumentGet = async titreDocumentId =>
  TitresDocuments.query().findById(titreDocumentId)

export { titresDocumentGet }
