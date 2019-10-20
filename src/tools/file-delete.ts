import { unlink } from 'fs'
import errorLog from './error-log'

const fileDelete = (path: string) =>
  new Promise((resolve, reject) =>
    unlink(path, (err: any) => {
      if (err) {
        errorLog(`fichier: ${path}`, err)
        reject(err)
      }

      resolve(`fichier supprimé: ${path}`)
    })
  )

export default fileDelete
