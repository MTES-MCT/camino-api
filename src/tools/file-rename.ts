import { rename } from 'fs'
import { basename } from 'path'
import errorLog from './error-log'

const fileRename = async (pathOld: string, pathNew: string) =>
  new Promise((resolve, reject) => {
    rename(pathOld, pathNew, (err: any) => {
      if (err) {
        errorLog(`erreur lors du renommage: ${basename(pathOld)}`, err)

        reject(err)
      }

      console.log(
        `fichier renommé: ${basename(pathOld)} -> ${basename(pathNew)} `
      )
      resolve()
    })
  })

export default fileRename
