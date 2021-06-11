import { mkdir } from 'fs'

import errorLog from './error-log'

const dirCreate = async (name: string) =>
  new Promise((resolve, reject) => {
    mkdir(name, { recursive: true }, (err: any) => {
      if (err) {
        if (err.message.match('EEXIST')) {
          return resolve(`dossier déjà existant ${name}`)
        }

        errorLog(`dossier non créé: ${name}`, err)

        return reject(err)
      }

      const log = `dossier créé: ${name}`

      console.info(log)

      resolve(log)
    })
  })

export default dirCreate
