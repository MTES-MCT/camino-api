import { ITitreTravaux, IContenu } from '../../../types'
import { ISpreadsheet } from '../types'
import { titresTravauxGet } from '../../../database/queries/titres-travaux'

const id = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_TRAVAUX

const get = async () => titresTravauxGet({}, {})

const tables = [
  {
    id: 1,
    name: 'titresTravaux',
    columns: ['id', 'typeId', 'titreId', 'statutId', 'ordre']
  },
  {
    id: 2,
    name: 'titresTravauxEtapes',
    columns: [
      'id',
      'titreTravauxId',
      'typeId',
      'statutId',
      'ordre',
      'date',
      'duree',
      'surface',
      'contenu'
    ],
    callbacks: {
      contenu: (v: IContenu) => JSON.stringify(v)
    },
    parents: ['etapes']
  }
]

const spreadsheet = {
  name: 'titres-travaux',
  id,
  get,
  tables
} as ISpreadsheet<ITitreTravaux>

export default spreadsheet
