import { mocked } from 'ts-jest/utils'

import { titreFilePathsRename } from './titre-fichiers-rename'
import fileRename from '../../tools/file-rename'

import {
  titreNew,
  titreNewSansDemarches,
  titreNewSansEtapes,
  titreNewDemarchesSansChangement
} from './__mocks__/titre-fichiers-rename'

jest.mock('fs', () => ({
  existsSync: jest.fn().mockResolvedValue(true)
}))

jest.mock('../../tools/file-rename', () => ({
  default: jest.fn().mockResolvedValue(true),
  __esModule: true
}))

const fileRenameMock = mocked(fileRename, true)

console.info = jest.fn()

describe("renomme les fichiers d'un titre", () => {
  test("renomme les fichiers d'un titre", async () => {
    await titreFilePathsRename(
      {
        etapes: {
          'new-titre-id-demarche-01-etape-01':
            'old-titre-id-demarche-01-etape-01'
        }
      },
      titreNew
    )

    expect(fileRenameMock).toHaveBeenCalledWith(
      'files/demarches/old-titre-id-demarche-01-etape-01',
      'files/demarches/new-titre-id-demarche-01-etape-01_tmp'
    )
    expect(fileRenameMock).toHaveBeenLastCalledWith(
      'files/demarches/new-titre-id-demarche-01-etape-01_tmp',
      'files/demarches/new-titre-id-demarche-01-etape-01'
    )
  })

  test('ne renomme aucun fichier si un titre ne possède pas de fichiers', async () => {
    const relationsIdsUpdatedIndex = {
      etapes: {
        'new-titre-id-demarche-01-etape-01': 'old-titre-id-demarche-01-etape-01'
      }
    }

    await titreFilePathsRename(relationsIdsUpdatedIndex, titreNewSansDemarches)

    await titreFilePathsRename(relationsIdsUpdatedIndex, titreNewSansEtapes)

    expect(fileRenameMock).not.toHaveBeenCalled()
  })

  test("ne renomme aucun fichier si le nom n'a pas changé", async () => {
    await titreFilePathsRename(
      {
        etapes: {
          'old-titre-id-demarche-01-etape-01':
            'old-titre-id-demarche-01-etape-01'
        }
      },
      titreNewDemarchesSansChangement
    )

    expect(fileRenameMock).not.toHaveBeenCalled()
  })

  test("ne renomme aucun fichier si aucun nom n'a changé", async () => {
    await titreFilePathsRename({}, titreNewDemarchesSansChangement)

    expect(fileRenameMock).not.toHaveBeenCalled()
  })
})
