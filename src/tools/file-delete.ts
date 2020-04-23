import { unlink } from 'fs'

import errorLog from './error-log'

const fileDelete = async (path: string) =>
  new Promise((resolve, reject) =>
    unlink(path, (err: any) => {
      if (err) {
        errorLog(`fichier non supprimé: ${path}`, err)

        return reject(err)
      }

      const log = `fichier supprimé: ${path}`

      console.info(log)

      resolve(log)
    })
  )

export default fileDelete
