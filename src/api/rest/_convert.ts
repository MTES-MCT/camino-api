import * as xlsx from 'xlsx'
import { Index } from '../../types'

type IFormat = 'csv' | 'xlsx' | 'ods' | 'geojson'

const tableConvert = (
  section:
    | 'titres'
    | 'demarches'
    | 'activites'
    | 'utilisateurs'
    | 'entreprises',
  elements: Index<any>[],
  format: IFormat
) => {
  let contenu = ''
  const sheet = xlsx.utils.json_to_sheet(elements as Index<any>[])

  if (format === 'csv') {
    contenu = xlsx.utils.sheet_to_csv(sheet)
  } else if (format === 'xlsx') {
    const wb = xlsx.utils.book_new()

    xlsx.utils.book_append_sheet(wb, sheet, section)

    contenu = xlsx.write(wb, { type: 'string' })
  }

  return contenu
}

export { tableConvert }
