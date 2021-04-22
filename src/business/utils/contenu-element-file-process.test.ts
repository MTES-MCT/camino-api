import { FileUpload } from 'graphql-upload'
import { ReadStream } from 'fs'
import { mocked } from 'ts-jest/utils'

import { IContenu, IContenuElement, ISection, ITitreEtape } from '../../types'

import {
  contenuElementFilesCreate,
  contenuElementFilesDelete,
  sectionsContenuAndFilesGet
} from './contenu-element-file-process'

import { objectClone } from '../../tools/index'
import dirCreate from '../../tools/dir-create'
import fileStreamCreate from '../../tools/file-stream-create'
import fileDelete from '../../tools/file-delete'

jest.mock('../../tools/dir-create', () => ({
  __esModule: true,
  default: jest.fn()
}))
const dirCreateMock = mocked(dirCreate, true)

jest.mock('../../tools/file-stream-create', () => ({
  __esModule: true,
  default: jest.fn()
}))
const fileStreamCreateMock = mocked(fileStreamCreate, true)

jest.mock('../../tools/file-delete', () => ({
  __esModule: true,
  default: jest.fn()
}))
const fileDeleteMock = mocked(fileDelete, true)

jest.mock('crypto-random-string', () => () => 'prefix')

describe('sectionsContenuAndFilesGet', () => {
  test('si pas de contenu alors pas de contenu ni de fichier', () => {
    expect(sectionsContenuAndFilesGet(null, [])).toEqual({
      contenu: null,
      newFiles: []
    })
  })

  test('si contenu sans nouveau fichier alors contenu identique', () => {
    const contenu = {
      arm: {
        mecanise: true,
        franchissements: 3,
        justificatif: 'nomdefichier.pdf'
      }
    }
    expect(
      sectionsContenuAndFilesGet(contenu, [
        {
          id: 'arm',
          elements: [
            { id: 'mecanise', nom: 'mecanise', type: 'checkbox' },
            { id: 'franchissements', nom: 'franchissements', type: 'number' },
            { id: 'justificatif', nom: 'justificatif', type: 'file' }
          ]
        }
      ])
    ).toMatchObject({
      contenu: objectClone(contenu),
      newFiles: []
    })
  })

  test('si contenu avec element multiple sans nouveau fichier alors contenu identique', () => {
    const contenu = {
      arm: {
        mecanise: true,
        franchissements: 3,
        machines: [
          { marque: 'toto', justificatif: 'nomdefichier.pdf' },
          { marque: 'titi', justificatif: 'nomdefichier.pdf' }
        ]
      }
    }
    expect(
      sectionsContenuAndFilesGet(contenu, [
        {
          id: 'arm',
          elements: [
            { id: 'mecanise', nom: 'mecanise', type: 'checkbox' },
            { id: 'franchissements', nom: 'franchissements', type: 'number' },
            {
              id: 'machines',
              nom: 'machines',
              type: 'multiple',
              elements: [
                {
                  id: 'marque',
                  nom: 'marque',
                  type: 'text'
                },
                { id: 'justificatif', nom: 'justificatif', type: 'file' }
              ]
            }
          ]
        }
      ])
    ).toMatchObject({
      contenu: objectClone(contenu),
      newFiles: []
    })
  })

  test('si contenu avec nouveau fichier alors contenu modifié', () => {
    const contenu = {
      arm: {
        mecanise: true,
        franchissements: 3,
        justificatif: { file: { filename: 'super.pdf' } as FileUpload }
      }
    }

    const newContenu = objectClone(contenu) as IContenu
    newContenu.arm.justificatif = 'prefix-super.pdf'

    const res = sectionsContenuAndFilesGet(contenu, [
      {
        id: 'arm',
        elements: [
          { id: 'mecanise', nom: 'mecanise', type: 'checkbox' },
          { id: 'franchissements', nom: 'franchissements', type: 'number' },
          { id: 'justificatif', nom: 'justificatif', type: 'file' }
        ]
      }
    ])
    expect(res).toMatchObject({
      contenu: newContenu,
      newFiles: [{ filename: 'prefix-super.pdf' }]
    })
  })

  test('si contenu avec element multiple avec nouveau fichier alors contenu modifié', () => {
    const contenu = {
      arm: {
        mecanise: true,
        franchissements: 3,
        machines: [
          { marque: 'toto', justificatif: 'nomdefichier.pdf' },
          {
            marque: 'titi',
            justificatif: { file: { filename: 'fichier2.pdf' } as FileUpload }
          }
        ]
      }
    }

    const newContenu = objectClone(contenu) as IContenu
    const elements = newContenu.arm.machines as IContenuElement[]
    elements[1].justificatif = 'prefix-fichier2.pdf'

    const res = sectionsContenuAndFilesGet(contenu, [
      {
        id: 'arm',
        elements: [
          { id: 'mecanise', nom: 'mecanise', type: 'checkbox' },
          { id: 'franchissements', nom: 'franchissements', type: 'number' },
          {
            id: 'machines',
            nom: 'machines',
            type: 'multiple',
            elements: [
              {
                id: 'marque',
                nom: 'marque',
                type: 'text'
              },
              { id: 'justificatif', nom: 'justificatif', type: 'file' }
            ]
          }
        ]
      }
    ])
    expect(res).toMatchObject({
      contenu: newContenu,
      newFiles: [{ filename: 'prefix-fichier2.pdf' }]
    })
  })
})

describe('contenuElementFileProcess', () => {
  test('enregistre les nouveaux fichiers sur le disque', async () => {
    const file = {
      createReadStream: () => (({} as unknown) as ReadStream),
      filename: 'toto.pdf',
      encoding: 'utf-8',
      mimetype: 'application/pdf'
    }

    await contenuElementFilesCreate([file, file], 'demarches', 'etapeId')

    expect(dirCreateMock).toHaveBeenCalledTimes(1)
    expect(fileStreamCreateMock).toHaveBeenCalledTimes(2)
  })

  test('supprime les anciens fichiers sur le disque', async () => {
    const sections = [
      {
        id: 'arm',
        elements: [
          { id: 'mecanise', nom: 'mecanise', type: 'checkbox' },
          { id: 'franchissements', nom: 'franchissements', type: 'number' },
          { id: 'justificatif', nom: 'justificatif', type: 'file' },
          { id: 'facture', nom: 'facture', type: 'file' },
          {
            id: 'machines',
            nom: 'machines',
            type: 'multiple',
            elements: [
              {
                id: 'marque',
                nom: 'marque',
                type: 'text'
              },
              { id: 'entretien', nom: 'entretien', type: 'file' }
            ]
          }
        ]
      }
    ] as ISection[]

    const oldContenu = {
      arm: {
        mecanise: true,
        justificatif: 'fichier.pdf',
        facture: 'facture.pdf',
        machines: [
          { marque: 'toto', justificatif: 'justificatif1.pdf' },
          { marque: 'titi', entretien: 'nomdefichier.pdf' }
        ]
      }
    } as IContenu
    const contenu = {
      arm: {
        mecanise: true,
        justificatif: 'newfichier.pdf',
        facture: 'facture.pdf',
        machines: [{ marque: 'toto', entretien: 'justificatif1.pdf' }]
      }
    }

    await contenuElementFilesDelete(
      'demarches',
      'etapeId',
      sections,
      [({ contenu } as unknown) as ITitreEtape],
      oldContenu
    )

    expect(fileDeleteMock).toHaveBeenCalledTimes(2)
  })
})
