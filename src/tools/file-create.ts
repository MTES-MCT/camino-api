import { writeFile } from 'fs'
import errorLog from './error-log'

const fileCreate = async (name: string, content: string) =>
  new Promise((resolve, reject) => {
    writeFile(name, content, (err: any) => {
      if (err) {
        errorLog(`fichier: ${name}`, err)
        reject(err)
      }

      console.log('fichier:', name)
      resolve()
    })
  })

export default fileCreate
