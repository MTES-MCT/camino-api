import 'dotenv/config'

import { dbManager } from './init'
import {
  visibiliteCheck,
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

describe('Visibilité des démarches', () => {
  test.each`
    administrationId       | voir
    ${'ope-onf-973-01'}    | ${true}
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    "un utilisateur admin de l’administration $administrationId peut voir les démarches d'un titre ARM : $voir",
    async ({ administrationId, voir }) =>
      visibiliteCheck(administrationId, voir, 'demarches', 'arm', false)
  )

  test.each`
    administrationId       | voir
    ${'ope-onf-973-01'}    | ${true}
    ${'dea-guyane-01'}     | ${true}
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    "un utilisateur admin de l’administration $administrationId peut voir les démarches d'un titre AXM : $voir",
    async ({ administrationId, voir }) =>
      visibiliteCheck(administrationId, voir, 'demarches', 'axm', false)
  )

  test.each`
    administrationId       | voir
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    "un utilisateur admin de l’administration $administrationId peut voir les démarches d'un titre CXM : $voir",
    async ({ administrationId, voir }) =>
      visibiliteCheck(administrationId, voir, 'demarches', 'cxm', false)
  )

  test.each`
    administrationId       | voir
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    "un utilisateur admin de l’administration $administrationId peut voir les démarches d'un titre PRM : $voir",
    async ({ administrationId, voir }) =>
      visibiliteCheck(administrationId, voir, 'demarches', 'prm', false)
  )

  test.each`
    administrationId       | voir
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    "un utilisateur admin de l’administration $administrationId peut voir les démarches d'un titre PXM : $voir",
    async ({ administrationId, voir }) =>
      visibiliteCheck(administrationId, voir, 'demarches', 'pxm', false)
  )
})

describe('Création des démarches', () => {
  test.each`
    administrationId       | creer
    ${'ope-onf-973-01'}    | ${true}
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    "un utilisateur admin de l’administration $administrationId peut créer des démarches d'un titre ARM : $creer",
    async ({ administrationId, creer }) =>
      creationCheck(administrationId, creer, 'demarches', 'arm')
  )

  test.each`
    administrationId       | creer
    ${'ope-onf-973-01'}    | ${true}
    ${'dea-guyane-01'}     | ${true}
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    "un utilisateur admin de l’administration $administrationId peut créer des démarches d'un titre AXM : $creer",
    async ({ administrationId, creer }) =>
      creationCheck(administrationId, creer, 'demarches', 'axm')
  )

  test.each`
    administrationId       | creer
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    "un utilisateur admin de l’administration $administrationId peut créer des démarches d'un titre CXM : $creer",
    async ({ administrationId, creer }) =>
      creationCheck(administrationId, creer, 'demarches', 'cxm')
  )

  test.each`
    administrationId       | creer
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    "un utilisateur admin de l’administration $administrationId peut créer des démarches d'un titre PRM : $creer",
    async ({ administrationId, creer }) =>
      creationCheck(administrationId, creer, 'demarches', 'prm')
  )

  test.each`
    administrationId       | creer
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${true}
    ${'min-dajb-01'}       | ${false}
  `(
    "un utilisateur admin de l’administration $administrationId peut créer des démarches d'un titre PXM : $creer",
    async ({ administrationId, creer }) =>
      creationCheck(administrationId, creer, 'demarches', 'pxm')
  )
})

describe('Modification des démarches', () => {
  test.each`
    administrationId       | modifier
    ${'ope-onf-973-01'}    | ${false}
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${false}
    ${'min-dajb-01'}       | ${false}
  `(
    "un utilisateur admin de l’administration $administrationId peut modifier des démarches d'un titre ARM : $modifier",
    async ({ administrationId, modifier }) =>
      modificationCheck(administrationId, modifier, 'demarches', 'arm')
  )

  test.each`
    administrationId       | modifier
    ${'ope-onf-973-01'}    | ${false}
    ${'dea-guyane-01'}     | ${false}
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${false}
    ${'min-dajb-01'}       | ${false}
  `(
    "un utilisateur admin de l’administration $administrationId peut modifier des démarches d'un titre AXM : $modifier",
    async ({ administrationId, modifier }) =>
      modificationCheck(administrationId, modifier, 'demarches', 'axm')
  )

  test.each`
    administrationId       | modifier
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${false}
    ${'min-dajb-01'}       | ${false}
  `(
    "un utilisateur admin de l’administration $administrationId peut modifier des démarches d'un titre CXM : $modifier",
    async ({ administrationId, modifier }) =>
      modificationCheck(administrationId, modifier, 'demarches', 'cxm')
  )

  test.each`
    administrationId       | modifier
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${false}
    ${'min-dajb-01'}       | ${false}
  `(
    "un utilisateur admin de l’administration $administrationId peut modifier des démarches d'un titre PRM : $modifier",
    async ({ administrationId, modifier }) =>
      modificationCheck(administrationId, modifier, 'demarches', 'prm')
  )

  test.each`
    administrationId       | modifier
    ${'min-mtes-dgec-01'}  | ${false}
    ${'min-mtes-dgaln-01'} | ${false}
    ${'min-dajb-01'}       | ${false}
  `(
    "un utilisateur admin de l’administration $administrationId peut modifier des démarches d'un titre PXM : $modifier",
    async ({ administrationId, modifier }) =>
      modificationCheck(administrationId, modifier, 'demarches', 'pxm')
  )
})
