/* eslint-disable no-undef */
type ICb = (text: string) => unknown

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
