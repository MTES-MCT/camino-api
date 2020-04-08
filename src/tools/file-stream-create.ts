import { createWriteStream, unlink } from 'fs'
import errorLog from './error-log'

const fileStreamCreate = async (stream: any, path: string) =>
  new Promise((resolve, reject) => {
    stream
      .on('error', (err: any) => {
        unlink(path, () => {
          errorLog(`fichier: ${path}`, err)
          reject(err)
        })
      })
      .pipe(createWriteStream(path))
      .on('error', (err: any) => {
        unlink(path, () => {
          errorLog(`fichier: ${path}`, err)
          reject(err)
        })
      })
      .on('finish', () => {
        console.info(`fichier ajouté: ${path}`)
        resolve()
      })
  })

export default fileStreamCreate
