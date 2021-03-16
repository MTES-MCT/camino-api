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

describe('Visibilité des titres par les administrations gestionnaires ou associées', () => {
  test.each`
    administrationId        | visible
    ${'ope-onf-973-01'}     | ${true}
    ${'dea-guyane-01'}      | ${true}
    ${'dre-grand-est-01'}   | ${false}
    ${'pre-97302-01'}       | ${true}
    ${'aut-mrae-guyane-01'} | ${true}
    ${'min-mtes-dgec-01'}   | ${true}
    ${'min-mtes-dgaln-01'}  | ${true}
    ${'min-dajb-01'}        | ${true}
  `(
    'un utilisateur admin de l’administration $administrationId peut voir un titre ARM : $visible',
    async ({ administrationId, visible }) =>
      visibleCheck(administrationId, visible, 'titres', 'arm', false)
  )

  test.each`
    administrationId        | visible
    ${'ope-onf-973-01'}     | ${true}
    ${'dea-guyane-01'}      | ${true}
    ${'dre-grand-est-01'}   | ${false}
    ${'pre-97302-01'}       | ${false}
    ${'aut-mrae-guyane-01'} | ${false}
    ${'min-mtes-dgec-01'}   | ${true}
    ${'min-mtes-dgaln-01'}  | ${true}
    ${'min-dajb-01'}        | ${true}
  `(
    'un utilisateur admin de l’administration $administrationId peut voir un titre AXM : $visible',
    async ({ administrationId, visible }) =>
      visibleCheck(administrationId, visible, 'titres', 'axm', false)
  )

  test.each`
    administrationId        | visible
    ${'ope-onf-973-01'}     | ${false}
    ${'dea-guyane-01'}      | ${false}
    ${'dre-grand-est-01'}   | ${false}
    ${'pre-97302-01'}       | ${false}
    ${'aut-mrae-guyane-01'} | ${false}
    ${'min-mtes-dgec-01'}   | ${true}
    ${'min-mtes-dgaln-01'}  | ${true}
    ${'min-dajb-01'}        | ${true}
  `(
    'un utilisateur admin de l’administration $administrationId peut voir un titre CXM : $visible',
    async ({ administrationId, visible }) =>
      visibleCheck(administrationId, visible, 'titres', 'cxm', false)
  )

  test.each`
    administrationId        | visible
    ${'ope-onf-973-01'}     | ${false}
    ${'dea-guyane-01'}      | ${false}
    ${'dre-grand-est-01'}   | ${false}
    ${'pre-97302-01'}       | ${false}
    ${'aut-mrae-guyane-01'} | ${false}
    ${'min-mtes-dgec-01'}   | ${true}
    ${'min-mtes-dgaln-01'}  | ${true}
    ${'min-dajb-01'}        | ${true}
  `(
    'un utilisateur admin de l’administration $administrationId peut voir un titre PRM : $visible',
    async ({ administrationId, visible }) =>
      visibleCheck(administrationId, visible, 'titres', 'prm', false)
  )

  test.each`
    administrationId        | voir
    ${'ope-onf-973-01'}     | ${false}
    ${'dea-guyane-01'}      | ${false}
    ${'dre-grand-est-01'}   | ${false}
    ${'pre-97302-01'}       | ${false}
    ${'aut-mrae-guyane-01'} | ${false}
    ${'min-mtes-dgec-01'}   | ${true}
    ${'min-mtes-dgaln-01'}  | ${true}
    ${'min-dajb-01'}        | ${true}
  `(
    'un utilisateur admin de l’administration $administrationId peut voir un titre PXM : $voir',
    async ({ administrationId, voir }) =>
      visibleCheck(administrationId, voir, 'titres', 'pxm', false)
  )
})

describe('Visibilité des titres par les administrations locales', () => {
  test.each`
    administrationId        | voir
    ${'ope-onf-973-01'}     | ${true}
    ${'dea-guyane-01'}      | ${true}
    ${'dre-grand-est-01'}   | ${true}
    ${'pre-97302-01'}       | ${true}
    ${'aut-mrae-guyane-01'} | ${true}
  `(
    'un utilisateur admin de l’administration $administrationId peut voir un titre ARM : $voir',
    async ({ administrationId, voir }) =>
      visibleCheck(administrationId, voir, 'titres', 'arm', true)
  )

  test.each`
    administrationId        | voir
    ${'ope-onf-973-01'}     | ${true}
    ${'dea-guyane-01'}      | ${true}
    ${'dre-grand-est-01'}   | ${true}
    ${'pre-97302-01'}       | ${true}
    ${'aut-mrae-guyane-01'} | ${true}
  `(
    'un utilisateur admin de l’administration $administrationId peut voir un titre AXM : $voir',
    async ({ administrationId, voir }) =>
      visibleCheck(administrationId, voir, 'titres', 'axm', true)
  )

  test.each`
    administrationId        | voir
    ${'ope-onf-973-01'}     | ${true}
    ${'dea-guyane-01'}      | ${true}
    ${'dre-grand-est-01'}   | ${true}
    ${'pre-97302-01'}       | ${true}
    ${'aut-mrae-guyane-01'} | ${true}
  `(
    'un utilisateur admin de l’administration $administrationId peut voir un titre CXM : $voir',
    async ({ administrationId, voir }) =>
      visibleCheck(administrationId, voir, 'titres', 'cxm', true)
  )

  test.each`
    administrationId        | voir
    ${'ope-onf-973-01'}     | ${true}
    ${'dea-guyane-01'}      | ${true}
    ${'dre-grand-est-01'}   | ${true}
    ${'pre-97302-01'}       | ${true}
    ${'aut-mrae-guyane-01'} | ${true}
  `(
    'un utilisateur admin de l’administration $administrationId peut voir un titre PRM : $voir',
    async ({ administrationId, voir }) =>
      visibleCheck(administrationId, voir, 'titres', 'prm', true)
  )

  test.each`
    administrationId        | voir
    ${'ope-onf-973-01'}     | ${true}
    ${'dea-guyane-01'}      | ${true}
    ${'dre-grand-est-01'}   | ${true}
    ${'pre-97302-01'}       | ${true}
    ${'aut-mrae-guyane-01'} | ${true}
  `(
    'un utilisateur admin de l’administration $administrationId peut voir un titre PXM : $voir',
    async ({ administrationId, voir }) =>
      visibleCheck(administrationId, voir, 'titres', 'pxm', true)
  )
})

describe('Création des titres', () => {
  test.each`
    administrationId       | creer
    ${'ope-onf-973-01'}    | ${true}
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    'un utilisateur admin de l’administration $administrationId peut créer un titre ARM : $creer',
    async ({ administrationId, creer }) =>
      creationCheck(administrationId, creer, 'titres', 'arm')
  )

  test.each`
    administrationId       | creer
    ${'ope-onf-973-01'}    | ${true}
    ${'dea-guyane-01'}     | ${true}
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    'un utilisateur admin de l’administration $administrationId peut créer un titre AXM : $creer',
    async ({ administrationId, creer }) =>
      creationCheck(administrationId, creer, 'titres', 'axm')
  )

  test.each`
    administrationId       | creer
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    'un utilisateur admin de l’administration $administrationId peut créer un titre CXM : $creer',
    async ({ administrationId, creer }) =>
      creationCheck(administrationId, creer, 'titres', 'cxm')
  )

  test.each`
    administrationId       | creer
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    'un utilisateur admin de l’administration $administrationId peut créer un titre PRM : $creer',
    async ({ administrationId, creer }) =>
      creationCheck(administrationId, creer, 'titres', 'prm')
  )

  test.each`
    administrationId       | creer
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    'un utilisateur admin de l’administration $administrationId peut créer un titre PXM : $creer',
    async ({ administrationId, creer }) =>
      creationCheck(administrationId, creer, 'titres', 'pxm')
  )
})

describe('Modification des titres', () => {
  test.each`
    administrationId       | modifier
    ${'ope-onf-973-01'}    | ${true}
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    'un utilisateur admin de l’administration $administrationId peut modifier un titre ARM : $modifier',
    async ({ administrationId, modifier }) =>
      modificationCheck(administrationId, modifier, 'titres', 'arm')
  )

  test.each`
    administrationId       | modifier
    ${'ope-onf-973-01'}    | ${false}
    ${'dea-guyane-01'}     | ${true}
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    'un utilisateur admin de l’administration $administrationId peut modifier un titre AXM : $modifier',
    async ({ administrationId, modifier }) =>
      modificationCheck(administrationId, modifier, 'titres', 'axm')
  )

  test.each`
    administrationId       | modifier
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    'un utilisateur admin de l’administration $administrationId peut modifier un titre CXM : $modifier',
    async ({ administrationId, modifier }) =>
      modificationCheck(administrationId, modifier, 'titres', 'cxm')
  )

  test.each`
    administrationId       | modifier
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    'un utilisateur admin de l’administration $administrationId peut modifier un titre PRM : $modifier',
    async ({ administrationId, modifier }) =>
      modificationCheck(administrationId, modifier, 'titres', 'prm')
  )

  test.each`
    administrationId       | modifier
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    'un utilisateur admin de l’administration $administrationId peut modifier un titre PXM : $modifier',
    async ({ administrationId, modifier }) =>
      modificationCheck(administrationId, modifier, 'titres', 'pxm')
  )
})
