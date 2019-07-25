import { writeFile } from 'fs-extra'
import errorLog from './error-log'

const fileCreate = async (name, content) => {
  try {
    await writeFile(name, content, 'utf8')
    console.log('fichier:', name)
  } catch (err) {
    errorLog(`fichier: ${name}`, err)
  }
}

export default fileCreate
