import fileCreate from './file-create'
import { mkdirSync, readFileSync, rmdirSync } from 'fs'

console.error = jest.fn()
console.info = jest.fn()

const workingDir = 'testFileCreateTmp'
const pathGet = (path: string) => `${workingDir}/${path}`
const workingDirClean = () => {
  try {
    rmdirSync(workingDir, { recursive: true })
  } catch (e) {
    // ignore catch
  }
}

describe('crée des fichiers', () => {
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

  test('crée un nouveau fichier', async () => {
    await fileCreate(pathGet('toto.txt'), 'contenu du fichier')
    expect(readFileSync(pathGet('toto.txt'), 'utf8')).toBe('contenu du fichier')
  })

  test('écrase le fichier si il existe déjà', async () => {
    await fileCreate(pathGet('toto.txt'), 'contenu du fichier')
    await fileCreate(pathGet('toto.txt'), 'nouveau contenu du fichier')
    expect(readFileSync(pathGet('toto.txt'), 'utf8')).toBe(
      'nouveau contenu du fichier'
    )
  })

  test('retourne une erreur si le répertoire n’existe pas', async () => {
    let error
    try {
      await fileCreate(pathGet('rep/toto.txt'), 'contenu du fichier')
    } catch (e) {
      error = e
    }
    expect(error).toBeTruthy()
  })
})
