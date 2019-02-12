const filePathCreate = fileName =>
  `./sources/${fileName.replace(/_/g, '-')}.json`

export default filePathCreate
