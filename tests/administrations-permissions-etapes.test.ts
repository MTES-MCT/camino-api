import 'dotenv/config'

import { dbManager } from './init'
import {
  visibleCheck,
  creationCheck,
  modificationCheck
} from './_utils/administrations-permissions'

console.info = jest.fn()
console.error = jest.fn()

beforeAll(async () => {
  await dbManager.populateDb()
})

afterAll(async () => {
  await dbManager.truncateDb()
  await dbManager.closeKnex()
})

describe('Visibilité des étapes', () => {
  test.each`
    administrationId       | visible | etapeTypeId
    ${'ope-onf-973-01'}    | ${true} | ${'mcr'}
    ${'min-mtes-dgaln-01'} | ${true} | ${'mcr'}
  `(
    "un utilisateur admin de l’administration $administrationId peut voir l'étape $etapeTypeId d'un titre ARM : $visible",
    async ({ administrationId, visible, etapeTypeId }) =>
      visibleCheck(
        administrationId,
        visible,
        'etapes',
        'arm',
        false,
        etapeTypeId
      )
  )

  test.each`
    administrationId       | visible | etapeTypeId
    ${'ope-onf-973-01'}    | ${true} | ${'mcr'}
    ${'dea-guyane-01'}     | ${true} | ${'mcr'}
    ${'min-mtes-dgaln-01'} | ${true} | ${'mcr'}
  `(
    "un utilisateur admin de l’administration $administrationId peut voir l'étape $etapeTypeId d'un titre AXM : $visible",
    async ({ administrationId, visible, etapeTypeId }) =>
      visibleCheck(
        administrationId,
        visible,
        'etapes',
        'axm',
        false,
        etapeTypeId
      )
  )

  test.each`
    administrationId       | visible | etapeTypeId
    ${'min-mtes-dgaln-01'} | ${true} | ${'mcr'}
  `(
    "un utilisateur admin de l’administration $administrationId peut voir l'étape $etapeTypeId d'un titre CXM : $visible",
    async ({ administrationId, visible, etapeTypeId }) =>
      visibleCheck(
        administrationId,
        visible,
        'etapes',
        'cxm',
        false,
        etapeTypeId
      )
  )

  test.each`
    administrationId       | visible | etapeTypeId
    ${'min-mtes-dgaln-01'} | ${true} | ${'mcr'}
  `(
    "un utilisateur admin de l’administration $administrationId peut voir l'étape $etapeTypeId d'un titre PRM : $visible",
    async ({ administrationId, visible, etapeTypeId }) =>
      visibleCheck(
        administrationId,
        visible,
        'etapes',
        'prm',
        false,
        etapeTypeId
      )
  )

  test.each`
    administrationId       | visible | etapeTypeId
    ${'min-mtes-dgaln-01'} | ${true} | ${'mcr'}
  `(
    "un utilisateur admin de l’administration $administrationId peut voir l'étape $etapeTypeId d'un titre PXM : $visible",
    async ({ administrationId, visible, etapeTypeId }) =>
      visibleCheck(
        administrationId,
        visible,
        'etapes',
        'pxm',
        false,
        etapeTypeId
      )
  )
})

describe('Création des étapes', () => {
  test.each`
    administrationId       | creer   | etapeTypeId
    ${'ope-onf-973-01'}    | ${true} | ${'mcr'}
    ${'min-mtes-dgaln-01'} | ${true} | ${'mcr'}
  `(
    'un utilisateur admin de l’administration $administrationId peut créer une étape $etapeTypeId sur un titre ARM : $creer',
    async ({ administrationId, creer }) =>
      creationCheck(administrationId, creer, 'etapes', 'arm')
  )

  test.each`
    administrationId       | creer   | etapeTypeId
    ${'ope-onf-973-01'}    | ${true} | ${'mcr'}
    ${'dea-guyane-01'}     | ${true} | ${'mcr'}
    ${'min-mtes-dgaln-01'} | ${true} | ${'mcr'}
  `(
    'un utilisateur admin de l’administration $administrationId peut créer une étape $etapeTypeId sur un titre AXM : $creer',
    async ({ administrationId, creer }) =>
      creationCheck(administrationId, creer, 'etapes', 'axm')
  )

  test.each`
    administrationId       | creer   | etapeTypeId
    ${'min-mtes-dgaln-01'} | ${true} | ${'mcr'}
  `(
    'un utilisateur admin de l’administration $administrationId peut créer une étape $etapeTypeId sur un titre CXM : $creer',
    async ({ administrationId, creer }) =>
      creationCheck(administrationId, creer, 'etapes', 'cxm')
  )

  test.each`
    administrationId       | creer   | etapeTypeId
    ${'min-mtes-dgaln-01'} | ${true} | ${'mcr'}
  `(
    'un utilisateur admin de l’administration $administrationId peut créer une étape $etapeTypeId sur un titre PRM : $creer',
    async ({ administrationId, creer }) =>
      creationCheck(administrationId, creer, 'etapes', 'prm')
  )

  test.each`
    administrationId       | creer   | etapeTypeId
    ${'min-mtes-dgaln-01'} | ${true} | ${'mcr'}
  `(
    'un utilisateur admin de l’administration $administrationId peut créer une étape $etapeTypeId sur un titre PXM : $creer',
    async ({ administrationId, creer }) =>
      creationCheck(administrationId, creer, 'etapes', 'pxm')
  )
})

describe('Modification des étapes', () => {
  test.each`
    administrationId       | modifier | etapeTypeId
    ${'ope-onf-973-01'}    | ${true}  | ${'mcr'}
    ${'min-mtes-dgaln-01'} | ${true}  | ${'mcr'}
  `(
    'un utilisateur admin de l’administration $administrationId peut modifier une étape $etapeTypeId sur un titre ARM : $modifier',
    async ({ administrationId, modifier, etapeTypeId }) =>
      modificationCheck(
        administrationId,
        modifier,
        'etapes',
        'arm',
        false,
        etapeTypeId
      )
  )

  test.each`
    administrationId       | modifier | etapeTypeId
    ${'ope-onf-973-01'}    | ${false} | ${'mcr'}
    ${'dea-guyane-01'}     | ${true}  | ${'mcr'}
    ${'min-mtes-dgaln-01'} | ${true}  | ${'mcr'}
  `(
    'un utilisateur admin de l’administration $administrationId peut modifier une étape $etapeTypeId sur un titre AXM : $modifier',
    async ({ administrationId, modifier, etapeTypeId }) =>
      modificationCheck(
        administrationId,
        modifier,
        'etapes',
        'axm',
        false,
        etapeTypeId
      )
  )

  test.each`
    administrationId       | modifier | etapeTypeId
    ${'min-mtes-dgaln-01'} | ${true}  | ${'mcr'}
  `(
    'un utilisateur admin de l’administration $administrationId peut modifier une étape $etapeTypeId sur un titre CXM : $modifier',
    async ({ administrationId, modifier, etapeTypeId }) =>
      modificationCheck(
        administrationId,
        modifier,
        'etapes',
        'cxm',
        false,
        etapeTypeId
      )
  )

  test.each`
    administrationId       | modifier | etapeTypeId
    ${'min-mtes-dgaln-01'} | ${true}  | ${'mcr'}
  `(
    'un utilisateur admin de l’administration $administrationId peut modifier une étape $etapeTypeId sur un titre PRM : $modifier',
    async ({ administrationId, modifier, etapeTypeId }) =>
      modificationCheck(
        administrationId,
        modifier,
        'etapes',
        'prm',
        false,
        etapeTypeId
      )
  )

  test.each`
    administrationId       | modifier | etapeTypeId
    ${'min-mtes-dgaln-01'} | ${true}  | ${'mcr'}
  `(
    'un utilisateur admin de l’administration $administrationId peut modifier une étape $etapeTypeId sur un titre PXM : $modifier',
    async ({ administrationId, modifier, etapeTypeId }) =>
      modificationCheck(
        administrationId,
        modifier,
        'etapes',
        'pxm',
        false,
        etapeTypeId
      )
  )
})
