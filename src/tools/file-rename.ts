import { rename } from 'fs'
import { join, basename } from 'path'
import errorLog from './error-log'

const fileRename = async (oldFileName: string, newFileName: string) => {
  const oldPath = join(process.cwd(), `files/${oldFileName}`)
  const newPath = join(process.cwd(), `files/${newFileName}`)

  return new Promise((resolve, reject) => {
    rename(oldPath, newPath, (err: any) => {
      if (err) {
        return reject(err)
      }

      resolve({ oldPath, newPath })
    })
  })
    .then(res => {
      console.info(
        `fichier renommé: ${basename(oldPath)} -> ${basename(newPath)} `
      )
    })
    .catch(err => {
      errorLog(`fichier renommé: ${basename(oldPath)}`, err)
    })
}

export default fileRename
