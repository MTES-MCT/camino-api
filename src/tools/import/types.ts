type ICb = (text: string) => any

interface ITable {
  name: string
  cb?: { [id: string]: ICb }
}

interface ISpreadsheet {
  name: string
  id?: string
  tables: ITable[]
  prefixFileName?: boolean
}

export { ISpreadsheet, ITable, ICb }
