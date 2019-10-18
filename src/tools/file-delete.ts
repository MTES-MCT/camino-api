import { unlink } from 'fs'

const fileDelete = (path: string) =>
  new Promise((resolve, reject) =>
    unlink(path, err => {
      if (err) reject(err)

      resolve(`fichier supprimé ${path}`)
    })
  )

export default fileDelete
