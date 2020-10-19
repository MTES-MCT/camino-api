import fileRename from './file-rename'
import fileCreate from './file-create'
import { mkdirSync, readFileSync, rmdirSync } from 'fs'

console.error = jest.fn()
console.info = jest.fn()

const workingDir = 'testFileRenameTmp'
const pathGet = (path: string) => `${workingDir}/${path}`
const workingDirClean = () => {
  try {
    rmdirSync(workingDir, { recursive: true })
  } catch (e) {
    // ignore catch
  }
}

describe('renomme des fichiers', () => {
  beforeEach(() => {
    workingDirClean()
    try {
      mkdirSync(workingDir)
    } catch (e) {
      // ignore catch
    }
  })
  afterEach(() => {
    workingDirClean()
  })

  test('retourne une erreur si le fichier n’existe pas', async () => {
    let error
    try {
      await fileRename(pathGet('toto.txt'), pathGet('tata.txt'))
    } catch (e) {
      error = e
    }
    expect(error).toBeTruthy()
  })

  test('renomme un fichier dans un répertoire', async () => {
    await fileCreate(pathGet('toto.txt'), 'contenu du fichier')
    await fileRename(pathGet('toto.txt'), pathGet('tata.txt'))

    expect(readFileSync(pathGet('tata.txt'), 'utf8')).toBe('contenu du fichier')
  })

  test('bouge un fichier dans un autre répertoire', async () => {
    mkdirSync(pathGet('first'))
    mkdirSync(pathGet('second'))
    await fileCreate(pathGet('first/toto.txt'), 'contenu du fichier')
    await fileRename(pathGet('first/toto.txt'), pathGet('second/tata.txt'))

    expect(readFileSync(pathGet('second/tata.txt'), 'utf8')).toBe(
      'contenu du fichier'
    )
  })
})
