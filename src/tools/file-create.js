import { writeFile } from 'fs-extra'
import errorLog from './error-log'

const fileCreate = async (name, content) => {
  try {
    await writeFile(name, content, 'utf8')
    console.log('Créé le fichier:', name)
  } catch (err) {
    errorLog(`Créé le fichier: ${name}`, err)
  }
}

export default fileCreate
