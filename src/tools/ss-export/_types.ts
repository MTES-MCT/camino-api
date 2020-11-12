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

export { ITable, ISpreadsheet, ICallbacks }
