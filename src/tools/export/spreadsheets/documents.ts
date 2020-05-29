import { IDocument } from '../../../types'
import { ISpreadsheet } from '../types'
import { documentsGet } from '../../../database/queries/documents'

const documentsSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_EXPORT_DOCUMENTS

const tables = [
  {
    id: 1,
    name: 'documents',
    columns: [
      'id',
      'typeId',
      'date',
      'titreEtapeId',
      'titreActiviteId',
      'entrepriseId',
      'description',
      'fichier',
      'fichierTypeId',
      'url',
      'uri',
      'jorf',
      'nor',
      'publicLecture',
      'entreprisesLecture'
    ]
  }
]

const spreadsheet = {
  name: 'documents',
  id: documentsSpreadsheetId,
  get: documentsGet,
  tables
} as ISpreadsheet<IDocument>

export default spreadsheet
