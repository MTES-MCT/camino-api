import * as path from 'path'

const filePathCreate = fileName =>
  `./sources/${fileName.replace(/_/g, '-')}.json`

export default filePathCreate
