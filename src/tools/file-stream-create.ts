import { createWriteStream, unlink } from 'fs'

const fileStreamCreate = async (stream: any, path: string) =>
  new Promise((resolve, reject) => {
    stream
      .on('error', (error: any) => {
        unlink(path, () => {
          reject(error)
        })
      })
      .pipe(createWriteStream(path))
      .on('error', reject)
      .on('finish', resolve)
  })

export default fileStreamCreate
