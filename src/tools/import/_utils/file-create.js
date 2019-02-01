import { writeFile } from 'fs-extra'

const fileCreate = async (name, content) => {
  try {
    await writeFile(name, content, 'utf8')
    console.log('File:', name)
  } catch (err) {
    console.log('File: error', err)
  }
}

export default fileCreate
