interface ICallbacks {
  [id: string]: (v: any) => string
}

interface ITable {
  id: number
  name: string
  columns: (string | { id: string; key?: string; parentKey?: string })[]
  callbacks?: ICallbacks
  parents?: string[]
}

interface ISpreadsheet<T> {
  id: string
  name: string
  get: () => Promise<T[]>
  tables: ITable[]
}

interface ISpreadsheetMultiple {
  id: string
  name: string
  gets: { [name: string]: () => Promise<any[]> }
  tables: ITable[]
}

export { ITable, ISpreadsheet, ISpreadsheetMultiple, ICallbacks }
