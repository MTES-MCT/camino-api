import { writeFile } from 'fs'

import errorLog from './error-log'

const dirCreate = async (name: string, content: string) =>
  new Promise((resolve, reject) => {
    writeFile(name, content, (err: any) => {
      if (err) {
        errorLog(`fichier non créé: ${name}`, err)

        return reject(err)
      }

      const log = `fichier créé: ${name}`

      console.info(log)

      resolve(log)
    })
  })

export default dirCreate
