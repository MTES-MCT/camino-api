import { ISpreadsheet, ICb } from './types'
import PQueue from 'p-queue'
import * as makeDir from 'make-dir'
import errorLog from '../error-log'
import { spreadsheetsGet } from '../api-google-spreadsheets/index'
import credentials from './credentials'
import fileCreate from '../file-create'
import spreadsheets from './spreadsheets'
import { Index } from '../../types'

const ssImport = async () => {
  // crée le dossier /sources
  await makeDir('./sources')

  // construit un tableau de promesses
  // de requêtes à Google Spreadsheets
  const spreadsheetsPromises = spreadsheets.reduce(
    (r: (() => Promise<void>)[], s) => {
      if (s.id) {
        r.push(() => spreadsheetToJsonFiles(s))
      }

      return r
    },
    []
  )

  // exécute les requêtes en série
  // avec PQueue plutôt que Promise.all
  // pour ne pas surcharger l'API de google
  const queue = new PQueue({
    concurrency: 1,
    intervalCap: 1,
    interval: 4000
  })
  await queue.addAll(spreadsheetsPromises)
}

const spreadsheetToJsonFiles = async ({
  id,
  name,
  tables,
  prefixFileName
}: ISpreadsheet) => {
  console.info(`spreadheet: ${name}`)

  try {
    // construit la liste avec un fichier par table
    const filesList = filesListBuild({
      name,
      tables,
      prefixFileName
    } as ISpreadsheet)

    // récupère un tableau avec une entrée { range, majorDimension, values }
    const sheets = await spreadsheetsGet(
      credentials,
      id!,
      filesList.map(({ worksheetName }) => worksheetName)
    )

    if (!sheets) {
      throw new Error(`aucune feuille récupérée name: ${name}, id: ${id}`)
    }

    // convertit la réponse en json
    // la première ligne de value forme les clés
    const jsons = sheets.map(sheet =>
      sheet.values?.length
        ? rowsToJson(sheet.values.shift() as string[], sheet.values)
        : []
    )

    await Promise.all(
      filesList.map(({ path, cb }, i) => {
        // applique le callback si il existe
        const json = cb ? jsonParse(jsons[i], cb, path) : jsons[i]

        return fileCreate(path, JSON.stringify(json, null, 2))
      })
    )
  } catch (error) {
    errorLog(error)
  }
}

const jsonParse = (
  json: Index<any>[],
  cb: { [id: string]: ICb },
  path: string
) =>
  json.map(row =>
    Object.keys(cb).reduce((row: Index<any>, col) => {
      const value = row[col]

      if (!(col in row) || !value) return row

      try {
        row[col] = cb[col](value)

        return row
      } catch (e) {
        throw new Error(
          `Could not parse field ${path}, ${col} = ${value}: ${e.message}`
        )
      }
    }, row)
  )

// retourne un tableau par spreadsheet
// une promesse par onglet de la spreadsheet
const filesListBuild = ({ name, tables, prefixFileName }: ISpreadsheet) =>
  tables.map(table => ({
    path: filePathCreate(prefixFileName ? `${name}-${table.name}` : table.name),
    worksheetName: table.name,
    cb: table.cb
  }))

const rowsToJson = (columns: string[], rows: string[][]) =>
  rows.map(row =>
    columns.reduce((acc: Index<any>, column, index) => {
      if (row[index]) {
        acc[column] = row[index]
      }

      return acc
    }, {})
  )

const filePathCreate = (fileName: string) =>
  `./sources/${fileName.replace(/_/g, '-')}.json`

export default ssImport
