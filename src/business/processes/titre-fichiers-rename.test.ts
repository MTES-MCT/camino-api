import { mocked } from 'ts-jest/utils'

import { titreFichiersRename } from './titre-fichiers-rename'
import fileRename from '../../tools/file-rename'

import {
  titreNew,
  titreNewSansDemarches,
  titreNewDemarchesVides,
  titreNewSansEtapes,
  titreNewDemarchesSansChangement
} from './__mocks__/titre-fichiers-rename'

jest.mock('../../tools/file-rename', () => ({
  default: jest.fn().mockResolvedValue(true)
}))

const fileRenameMock = mocked(fileRename, true)

console.log = jest.fn()

describe("renomme les fichiers d'un titre", () => {
  test("renomme les fichiers d'un titre", async () => {
    await titreFichiersRename('old-titre-id', titreNew)

    expect(fileRenameMock).toHaveBeenNthCalledWith(
      1,
      'old-titre-id-demarche-01-etape-01-document-01.pdf',
      'new-titre-id-demarche-01-etape-01-document-01.pdf'
    )
    expect(fileRenameMock).toHaveBeenNthCalledWith(
      2,
      'old-titre-id-demarche-01-etape-01-document-03.pdf',
      'new-titre-id-demarche-01-etape-01-document-03.pdf'
    )
  })

  test("ne renomme aucun fichier si un titre n'a pas de démarches", async () => {
    await titreFichiersRename('old-titre-id', titreNewSansDemarches)
    await titreFichiersRename('old-titre-id', titreNewDemarchesVides)
    await titreFichiersRename('old-titre-id', titreNewSansEtapes)

    expect(fileRenameMock).not.toHaveBeenCalled()
  })

  test("ne renomme aucun fichier si le nom n'a pas changé", async () => {
    await titreFichiersRename('new-titre-id', titreNewDemarchesSansChangement)

    expect(fileRenameMock).not.toHaveBeenCalled()
  })
})
