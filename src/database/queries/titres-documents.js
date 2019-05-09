import TitresDocuments from '../models/titres-documents'

const titreDocumentGet = async titreDocumentId =>
  TitresDocuments.query().findById(titreDocumentId)

export { titreDocumentGet }
