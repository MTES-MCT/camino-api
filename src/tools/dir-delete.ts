import { rm } from 'fs'

import errorLog from './error-log'

const dirDelete = async (name: string) =>
  new Promise((resolve, reject) => {
    rm(name, { recursive: true }, (err: any) => {
      if (err) {
        errorLog(`dossier non supprimé: ${name}`, err)

        return reject(err)
      }

      const log = `dossier supprimé: ${name}`

      console.info(log)

      resolve(log)
    })
  })

export { dirDelete }
