import { ITitreActivite, IContenu, ISection } from '../../../types'
import { ISpreadsheet } from '../_types'
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
      'sections',
      'typeId',
      'statutId',
      'frequencePeriodeId',
      'annee'
    ],
    callbacks: {
      contenu: (v: IContenu[]) => JSON.stringify(v),
      sections: (v: ISection[]) => JSON.stringify(v)
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
