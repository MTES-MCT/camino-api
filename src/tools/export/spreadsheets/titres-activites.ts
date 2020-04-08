import { ITitreActivite, IContenu } from '../../../types'
import { ISpreadsheet } from '../types'
import { titresActivitesGet } from '../../../database/queries/titres-activites'

const id = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_ACTIVITES

const get = async () => titresActivitesGet({}, {}, 'super')

const tables = [
  {
    id: 1,
    name: 'titresActivites',
    columns: [
      'id',
      'titreId',
      'utilisateurId',
      'date',
      'dateSaisie',
      'contenu',
      'typeId',
      'statutId',
      'frequencePeriodeId',
      'annee'
    ],
    callbacks: {
      contenu: (v: IContenu) => JSON.stringify(v)
    }
  }
]

const spreadsheet = {
  name: 'titres-activites',
  id,
  get,
  tables
} as ISpreadsheet<ITitreActivite>

export default spreadsheet
