import { mocked } from 'ts-jest/utils'

import { titreFilePathsRename } from './titre-fichiers-rename'
import fileRename from '../../tools/file-rename'

import {
  titreNew,
  titreNewSansDemarches,
  titreNewDemarchesVides,
  titreNewSansEtapes,
  titreSansDocuments,
  titreDocumentsVide,
  titreNewDemarchesSansChangement
} from './__mocks__/titre-fichiers-rename'

jest.mock('../../tools/file-rename', () => ({
  default: jest.fn().mockResolvedValue(true)
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

    expect(fileRenameMock).toHaveBeenNthCalledWith(
      1,
      'files/etapes/old-titre-id-demarche-01-etape-01',
      'files/etapes/new-titre-id-demarche-01-etape-01'
    )
  })

  test('ne renomme aucun fichier si un titre ne possède pas de fichiers', async () => {
    const relationsIdsChangedIndex = {
      etapes: {
        'new-titre-id-demarche-01-etape-01': 'old-titre-id-demarche-01-etape-01'
      }
    }

    await titreFilePathsRename(relationsIdsChangedIndex, titreNewSansDemarches)

    await titreFilePathsRename(relationsIdsChangedIndex, titreNewDemarchesVides)

    await titreFilePathsRename(relationsIdsChangedIndex, titreNewSansEtapes)

    await titreFilePathsRename(relationsIdsChangedIndex, titreSansDocuments)

    await titreFilePathsRename(relationsIdsChangedIndex, titreDocumentsVide)

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
