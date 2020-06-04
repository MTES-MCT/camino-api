import { rename } from 'fs'
import { join, basename } from 'path'

import errorLog from './error-log'

const fileRename = async (oldFileName: string, newFileName: string) =>
  new Promise((resolve, reject) => {
    const oldPath = join(process.cwd(), oldFileName)
    const newPath = join(process.cwd(), newFileName)

    rename(oldPath, newPath, (err: any) => {
      if (err) {
        errorLog(`fichier non renommé: ${basename(oldPath)}`, err)

        return reject(err)
      }

      const log = `fichier renommé: ${basename(oldPath)} -> ${basename(
        newPath
      )}`

      console.info(log)

      resolve(log)
    })
  })

export default fileRename
