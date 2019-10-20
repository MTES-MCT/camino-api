import { rename } from 'fs'
import errorLog from './error-log'

const fileCreate = async (pathOld: string, pathNew: string) =>
  new Promise((resolve, reject) => {
    rename(pathOld, pathNew, (err: any) => {
      if (err) {
        errorLog(`erreur lors du renommage: ${pathOld}`, err)

        reject(err)
      }

      console.log(`fichier renommé: ${pathOld} ->  ${pathNew} `)
      resolve()
    })
  })

export default fileCreate
